// cypress/e2e/01_registration.cy.js
// F001 Patient Registration — 12 test cases (TC-01-001 to TC-01-012)
// Sources: HMS_TCS v1.1 §2.2.1, HMS_TPS v1.1 §2.1, HMS_TDS §2.2.1

describe('F001 Patient Registration', () => {
  let data;
  before(() => cy.fixture('test-data.json').then((f) => (data = f)));

  beforeEach(() => {
    cy.hmsReset('full_reset');
    cy.visitHome();
  });

  // ---- Equivalence Partitioning on contact number ----

  it('TC-01-001 contact < 10 digits is rejected (5 digits)', () => {
    cy.fillRegistration({ contact: data.contactSamples.tooShort5 });
    cy.submitRegistration();
    cy.location('pathname', { timeout: 8000 })
      .should('not.include', 'admin-panel.php');
    cy.hmsReset('reset_patients').then((r) => {
      // No patient row should have been created for kenny@gmail.com.
      expect(r.changes.delete_test_patients).to.eq(0);
    });
  });

  it('TC-01-002 contact = 10 digits is accepted', () => {
    cy.fillRegistration({ contact: data.contactSamples.valid10 });
    cy.submitRegistration();
    cy.location('pathname', { timeout: 8000 })
      .should('include', 'admin-panel.php');
  });

  it('TC-01-003 contact > 10 digits is rejected (11 digits)', () => {
    cy.fillRegistration({ contact: data.contactSamples.tooLong11, email: 'kenny3@gmail.com' });
    cy.submitRegistration();
    cy.location('pathname', { timeout: 8000 })
      .should('not.include', 'admin-panel.php');
  });

  // ---- Equivalence Partitioning + Decision Table on password ----

  it('TC-01-004 password == confirm password is accepted', () => {
    cy.fillRegistration({ password: 'kenny123', cpassword: 'kenny123' });
    cy.submitRegistration();
    cy.location('pathname', { timeout: 8000 })
      .should('include', 'admin-panel.php');
  });

  it('TC-01-005 password != confirm password is rejected and redirects to error1.php', () => {
    cy.fillRegistration({ email: 'kenny5@gmail.com', password: 'kenny123', cpassword: 'kenny456' });
    cy.submitRegistration();
    cy.location('pathname', { timeout: 8000 })
      .should('include', 'error1.php');
  });

  // ---- Boundary Value Analysis on contact number ----

  it('TC-01-006 contact field empty (0 digits) is rejected', () => {
    cy.fillRegistration({ email: 'kenny6@gmail.com', contact: data.contactSamples.empty });
    cy.submitRegistration();
    cy.location('pathname', { timeout: 8000 })
      .should('not.include', 'admin-panel.php');
  });

  it('TC-01-007 contact = 9 digits is rejected (just below boundary)', () => {
    cy.fillRegistration({ email: 'kenny7@gmail.com', contact: data.contactSamples.tooShort9 });
    cy.submitRegistration();
    cy.location('pathname', { timeout: 8000 })
      .should('not.include', 'admin-panel.php');
  });

  it('TC-01-008 contact = 11 digits is rejected (just above boundary)', () => {
    cy.fillRegistration({ email: 'kenny8@gmail.com', contact: data.contactSamples.tooLong11 });
    cy.submitRegistration();
    cy.location('pathname', { timeout: 8000 })
      .should('not.include', 'admin-panel.php');
  });

  // ---- Use Case Testing ----

  it('TC-01-009 Main Flow — registration completes end-to-end', () => {
    cy.fillRegistration({}); // defaults = valid kenny@gmail.com
    cy.submitRegistration();
    cy.location('pathname', { timeout: 8000 })
      .should('include', 'admin-panel.php');
    // Patient session is created — Welcome banner shows the patient's name.
    cy.contains(`${data.validPatient.fname} ${data.validPatient.lname}`).should('exist');
  });

  it('TC-01-010 Alternate Flow — "Already have an account?" link navigates to login', () => {
    cy.get('a[href="index1.php"]').click();
    cy.location('pathname').should('include', 'index1.php');
    cy.get('input[name="patsub"]').should('exist');
  });

  it('TC-01-011 Exception Flow — password mismatch redirects to error1.php', () => {
    cy.fillRegistration({ email: 'kenny11@gmail.com', password: 'kenny123', cpassword: 'kenny456' });
    cy.submitRegistration();
    cy.location('pathname', { timeout: 8000 })
      .should('include', 'error1.php');
  });

  it('TC-01-012 Exception Flow — invalid contact rejected', () => {
    cy.fillRegistration({ email: 'kenny12@gmail.com', contact: data.contactSamples.tooLong11 });
    cy.submitRegistration();
    cy.location('pathname', { timeout: 8000 })
      .should('not.include', 'admin-panel.php');
  });
});
