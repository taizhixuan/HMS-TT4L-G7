# Hospital Management System — Automated Testing (Cypress)

**Course:** CSE6324 Software Verification & Validation
**Assignment 2 — Group 7 (TT4L)**
**System under test:** [Hospital Management System](https://github.com/kishan0725/Hospital-Management-System) (PHP + MySQL)

This bundle contains the **Cypress** end-to-end automation scripts that execute the
test cases designed in our **Report 2 — Test Cases** following the
steps in **Report 3 — Test Procedure Specification**.

It automates **48 of the 52 documented test cases**. The remaining 4
(TC-04-012/013/014/015 — appointment cancellation, prescription creation, bill
generation) are **manual** per HMS_TCS because each spans the patient, doctor
and billing roles within one procedure.

---

## 1. Coverage at a glance

| Feature | Spec file | Tests | Report 3 procedure |
|---|---|---|---|
| F001 Patient Registration | `e2e/01_registration.cy.js` | 12 | TP-01-001 … 004 |
| F002 Patient Login | `e2e/02_patient-login.cy.js` | 8 | TP-02-001 … 004 |
| F003 Doctor Login | `e2e/03_doctor-login.cy.js` | 8 | TP-03-001 … 004 |
| F005 Appointment Booking | `e2e/04_appointment.cy.js` | 15 | TP-04-001 … 006 |
| REQ_UI004 Dashboard Navigation | `e2e/05_dashboard.cy.js` | 2 | TP-05 |
| REQ_UI007 UI Interaction | `e2e/06_ui-interaction.cy.js` | 3 | TP-06 |
| **Total** | | **48** | |

Every `it()` block is named with its **TC-ID** (e.g. `TC-01-007`), so each automated
test traces directly back to a case in Report 2 and a procedure in Report 3.

The test-design techniques applied: **Boundary Value Analysis**, **Equivalence
Partitioning**, **State Transition**, **Decision Table**, plus use-case **Main /
Alternate / Exception** flows.

---

## 2. Prerequisites

| Tool | Version | Check |
|---|---|---|
| Node.js | 18 or newer | `node --version` |
| npm | (bundled with Node) | `npm --version` |
| Google Chrome | latest stable | used for the test run |
| XAMPP | any recent | provides Apache + MySQL |

> **Database port:** the test-helper endpoint connects to MySQL on **port 3307**.
> If your MySQL runs on the default 3306, update the port in `_test_helpers.php`.

---

## 3. Setup

1. Deploy the Hospital Management System under XAMPP and import its database, so it
   is reachable at `http://localhost/Hospital-Management-System/`.

2. Place the testing files into the project root and merge:

   ```
   C:\xampp\htdocs\Hospital-Management-System\
   ├── (existing HMS PHP files)
   ├── package.json            ← from this bundle
   ├── cypress.config.js       ← from this bundle
   ├── _test_helpers.php       ← from this bundle
   └── cypress\                ← from this bundle
       ├── e2e\                (the 6 spec files)
       ├── fixtures\           (test-data.json)
       └── support\            (custom commands)
   ```

3. Install Cypress:

   ```powershell
   cd C:\xampp\htdocs\Hospital-Management-System
   npm install
   npx cypress verify        # expect: "Verified Cypress!"
   ```

4. Confirm the helper can reach the database:

   ```powershell
   curl "http://localhost/Hospital-Management-System/_test_helpers.php?action=ping"
   ```

   Expected: `{"ok":true,"action":"ping","changes":[],"db":"reachable"}`
   If you see `db_connect_failed`, fix the MySQL port (see Prerequisites).

---

## 4. Running the tests

**Interactive (Cypress GUI):**
```powershell
npm run cypress:open
```
Choose **E2E Testing → Chrome → Start E2E Testing**, then click a spec to watch it run.

**Headless (full suite):**
```powershell
npm run cypress:run
```

**Single feature:**
```powershell
npm run test:registration       # F001 (12 tests)
npm run test:patient-login      # F002 (8 tests)
npm run test:doctor-login       # F003 (8 tests)
npm run test:appointment        # F005 (15 tests)
npm run test:dashboard          # REQ_UI004 (2 tests)
npm run test:ui                 # REQ_UI007 (3 tests)
```

A headless run regenerates `cypress/videos/` (one MP4 per spec) and, on failure,
`cypress/screenshots/`. These are run artifacts and are **not** part of the
submitted source.

---

## 5. Bundle contents

| File | Purpose |
|---|---|
| `package.json` | Cypress dev-dependency and npm run scripts |
| `cypress.config.js` | Base URL, viewport, timeouts, video, retries |
| `_test_helpers.php` | DB seed/reset endpoint (called by `cy.hmsReset()`) |
| `cypress/support/e2e.js` | Global setup; ignores benign jQuery/Bootstrap exceptions |
| `cypress/support/commands.js` | Shared custom commands (`hmsReset`, `fillRegistration`, `loginAsDoctor`, `bookAppointment`, `captureAlerts`, …) |
| `cypress/fixtures/test-data.json` | Central test data (sample patient/doctor, boundary contact values, time slots) |
| `cypress/e2e/*.cy.js` | The six feature spec files (see §1) |

---

## 6. Notes for the reviewer

A few of the tests are written to **fail against the current HMS on purpose** — they
assert the *correct* behaviour and so reveal genuine defects in the system under
test (not faults in the test scripts):

1. **Empty contact accepted** — the registration form sets `minlength`/`maxlength="10"`
   but omits `required`, so a blank contact submits. `TC-01-006` expects rejection.
2. **No server-side length check** — contact length is only constrained client-side by
   `maxlength`; with that removed, 11-digit input is accepted. `TC-01-003 / 008 / 012`
   expect rejection.
3. **Blocking `alert()` on login failure** — handled in the tests via `cy.captureAlerts()`.

These differences are intentional and are reported as findings in our results.
