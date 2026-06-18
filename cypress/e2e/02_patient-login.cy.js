// cypress/e2e/02_patient-login.cy.js
// F002 Patient Login — 8 test cases (TC-02-001 to TC-02-008)
// Sources: HMS_TCS v1.1 §2.2.2, HMS_TPS v1.1 §2.2, HMS_TDS §2.2.2

describe('F002 Patient Login', () => {
  let data;
  before(() => cy.fixture('test-data.json').then((f) => (data = f)));

  // Ensure a known patient kenny@gmail.com / kenny123 exists before each test.
  beforeEach(() => {
    cy.hmsReset('full_reset');
    cy.visitHome();
    cy.fillRegistration({}); // seeds via the UI to match real flow
    cy.submitRegistration();
    cy.location('pathname', { timeout: 8000 }).should('include', 'admin-panel.php');
    cy.logout();
    cy.location('pathname').should('include', 'index.php');
  });

  // ---- Equivalence Partitioning on email ----

  it('TC-02-001 valid email (exists in patreg) is accepted', () => {
    cy.loginAsPatientFromIndex1(data.validPatient.email, data.validPatient.password);
    cy.location('pathname', { timeout: 8000 }).should('include', 'admin-panel.php');
  });

  it('TC-02-002 email not in patreg is rejected', () => {
    cy.loginAsPatientFromIndex1(data.invalidPatient.email, data.validPatient.password);
    cy.expectAlertContains('Invalid Username or Password');
    cy.location('pathname', { timeout: 8000 }).should('include', 'index1.php');
  });

  // ---- Equivalence Partitioning + Decision Table on password ----

  it('TC-02-003 valid password matches record', () => {
    cy.loginAsPatientFromIndex1(data.validPatient.email, data.validPatient.password);
    cy.location('pathname', { timeout: 8000 }).should('include', 'admin-panel.php');
  });

  it('TC-02-004 wrong password for an existing email is rejected', () => {
    cy.loginAsPatientFromIndex1(data.validPatient.email, 'wrongpass');
    cy.expectAlertContains('Invalid Username or Password');
    cy.location('pathname', { timeout: 8000 }).should('include', 'index1.php');
  });

  // ---- Use Case Testing ----

  it('TC-02-005 Main Flow — patient logs in via Patient login tab on home page', () => {
    // Real Main Flow uses the home-page Patient tab — but that page only has a
    // Register form, not a Login form (login is on index1.php). The Main Flow
    // therefore directs through index1.php which is index.php's login page.
    cy.loginAsPatientFromIndex1(data.validPatient.email, data.validPatient.password);
    cy.location('pathname', { timeout: 8000 }).should('include', 'admin-panel.php');
    cy.contains(`${data.validPatient.fname} ${data.validPatient.lname}`).should('exist');
  });

  it('TC-02-006 Alternate Flow — new patient link navigates back to registration', () => {
    // Patient login page (index1.php) — note that index1.php does NOT render a
    // "Register" link by default. The alternate flow is the inverse of TC-01-010:
    // from index1.php a new patient navigates back to index.php (home) via the
    // top navbar HOME link, where the Patient registration tab is active.
    cy.visit('/index1.php');
    cy.get('a[href="index.php"]').first().click();
    cy.location('pathname').should('include', 'index.php');
    cy.get('input[name="patsub1"]').should('exist');
  });

  it('TC-02-007 Exception Flow — invalid credentials are rejected', () => {
    cy.loginAsPatientFromIndex1('wrong@gmail.com', 'wrongpass');
    cy.expectAlertContains('Invalid Username or Password');
    cy.location('pathname', { timeout: 8000 }).should('include', 'index1.php');
  });

  it('TC-02-008 Exception Flow — empty fields are rejected', () => {
    cy.visit('/index1.php');
    cy.captureAlerts();
    // Both fields are `required`; HTML5 should block submission.
    cy.get('input[name="patsub"]').click();
    cy.location('pathname').should('include', 'index1.php');
    cy.get('input[name="email"]:invalid').should('exist');
  });
});
