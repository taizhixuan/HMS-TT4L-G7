<?php
// Test-only helper endpoint for Cypress E2E tests.
// CSE6324 Assignment 2 — Group 7 TT4L. Hospital Management System.
//
// Provides idempotent seeding and cleanup for the test database so that
// Cypress specs are deterministic. Hit via cy.request('/_test_helpers.php?action=...').
//
// Actions:
//   action=reset_patients     -> DELETE patreg rows for test emails (kenny*, wrong*).
//   action=reset_appointments -> DELETE appointmenttb rows for test pids and emails.
//   action=seed_doctor        -> INSERT doctor1 / doc123 in doctb if missing.
//   action=full_reset         -> All of the above.
//   action=ping               -> Return {"ok": true} for connectivity smoke test.

header('Content-Type: application/json');

// PHP 8.1+ defaults to throwing mysqli exceptions; we want clean JSON instead.
mysqli_report(MYSQLI_REPORT_OFF);

$con = @mysqli_connect('127.0.0.1', 'root', '', 'myhmsdb', 3307);
if (!$con) {
    http_response_code(500);
    $err = mysqli_connect_error() ?: 'unknown';
    $hint = 'check MySQL is running on port 3307 and myhmsdb has been imported from myhmsdb.sql';
    echo json_encode(['ok' => false, 'error' => 'db_connect_failed: ' . $err, 'hint' => $hint]);
    exit;
}

$action = isset($_GET['action']) ? $_GET['action'] : 'ping';
$result = ['ok' => true, 'action' => $action, 'changes' => []];

function run($con, &$result, $label, $sql) {
    if (!mysqli_query($con, $sql)) {
        $result['ok'] = false;
        $result['error'] = "$label failed: " . mysqli_error($con);
    } else {
        $result['changes'][$label] = mysqli_affected_rows($con);
    }
}

function reset_patients($con, &$result) {
    run($con, $result, 'delete_test_patients',
        "DELETE FROM patreg WHERE email LIKE 'kenny%@gmail.com' OR email = 'wrong@gmail.com'");
}

function reset_appointments($con, &$result) {
    run($con, $result, 'delete_test_appointments',
        "DELETE FROM appointmenttb WHERE email LIKE 'kenny%@gmail.com'");
}

function seed_doctor($con, &$result) {
    // doctb columns are (username, password, email, spec, docFees) — no 'name'.
    $check = mysqli_query($con, "SELECT username FROM doctb WHERE username = 'doctor1'");
    if ($check && mysqli_num_rows($check) === 0) {
        run($con, $result, 'insert_doctor1',
            "INSERT INTO doctb (username, password, email, spec, docFees) "
            . "VALUES ('doctor1', 'doc123', 'doctor1@hms.test', 'General', 100)");
    } else {
        $result['changes']['insert_doctor1'] = 0;
    }
}

switch ($action) {
    case 'ping':
        $result['db'] = 'reachable';
        break;
    case 'reset_patients':
        reset_patients($con, $result);
        break;
    case 'reset_appointments':
        reset_appointments($con, $result);
        break;
    case 'seed_doctor':
        seed_doctor($con, $result);
        break;
    case 'full_reset':
        reset_appointments($con, $result);
        reset_patients($con, $result);
        seed_doctor($con, $result);
        break;
    default:
        $result['ok'] = false;
        $result['error'] = 'unknown_action';
        http_response_code(400);
}

mysqli_close($con);
echo json_encode($result);
