// cypress/e2e/03_doctor-login.cy.js
// F003 Doctor Login — 8 test cases (TC-03-001 to TC-03-008)
// Sources: HMS_TCS v1.1 §2.2.3, HMS_TPS v1.1 §2.3, HMS_TDS §2.2.3

describe('F003 Doctor Login', () => {
  let data;
  before(() => cy.fixture('test-data.json').then((f) => (data = f)));

  beforeEach(() => {
    cy.hmsReset('seed_doctor');
    cy.visitHome();
  });

  // ---- Equivalence Partitioning on username ----

  it('TC-03-001 username exists in doctb is accepted', () => {
    cy.loginAsDoctor(data.validDoctor.username, data.validDoctor.password);
    cy.location('pathname', { timeout: 8000 }).should('include', 'doctor-panel.php');
  });

  it('TC-03-002 username not in doctb is rejected', () => {
    cy.loginAsDoctor(data.invalidDoctor.username, data.validDoctor.password);
    cy.expectAlertContains('Invalid Username or Password');
    cy.location('pathname', { timeout: 8000 }).should('include', 'index.php');
  });

  // ---- Equivalence Partitioning + Decision Table on password ----

  it('TC-03-003 password matches record', () => {
    cy.loginAsDoctor(data.validDoctor.username, data.validDoctor.password);
    cy.location('pathname', { timeout: 8000 }).should('include', 'doctor-panel.php');
  });

  it('TC-03-004 wrong password for an existing username is rejected', () => {
    cy.loginAsDoctor(data.validDoctor.username, 'wrongpass');
    cy.expectAlertContains('Invalid Username or Password');
    cy.location('pathname', { timeout: 8000 }).should('include', 'index.php');
  });

  // ---- Use Case Testing ----

  it('TC-03-005 Main Flow — doctor logs in via Doctor tab', () => {
    cy.loginAsDoctor(data.validDoctor.username, data.validDoctor.password);
    cy.location('pathname', { timeout: 8000 }).should('include', 'doctor-panel.php');
  });

  it('TC-03-006 Alternate Flow — user clicks wrong tab then corrects to Doctor tab', () => {
    cy.get('#home-tab').click();
    cy.get('#home').should('be.visible');
    cy.get('#profile-tab').click();
    cy.get('#profile').should('be.visible');
    cy.get('input[name="username3"]').type(data.validDoctor.username);
    cy.get('input[name="password3"]').type(data.validDoctor.password);
    cy.get('input[name="docsub1"]').click();
    cy.location('pathname', { timeout: 8000 }).should('include', 'doctor-panel.php');
  });

  it('TC-03-007 Exception Flow — invalid credentials are rejected', () => {
    cy.loginAsDoctor(data.invalidDoctor.username, data.invalidDoctor.password);
    cy.expectAlertContains('Invalid Username or Password');
    cy.location('pathname', { timeout: 8000 }).should('include', 'index.php');
  });

  it('TC-03-008 Exception Flow — empty fields are rejected', () => {
    cy.get('#profile-tab').click();
    cy.get('input[name="docsub1"]').click();
    // Doctor login form fields are `required`; HTML5 should block submission.
    cy.location('pathname').should('include', 'index.php');
    cy.get('input[name="username3"]:invalid').should('exist');
  });
});
