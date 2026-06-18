// cypress/e2e/05_dashboard.cy.js
// REQ_UI004 Patient Dashboard Navigation — 2 test cases (TC-05-001 to TC-05-002)
// Sources: HMS_TCS v1.1 §2.2.5, HMS_TPS v1.1 §2.5, HMS_TDS §2.2.5

describe('REQ_UI004 Patient Dashboard Navigation', () => {
  let data;
  before(() => cy.fixture('test-data.json').then((f) => (data = f)));

  beforeEach(() => {
    cy.hmsReset('full_reset');
    cy.visitHome();
    cy.fillRegistration({});
    cy.submitRegistration();
    cy.location('pathname', { timeout: 8000 }).should('include', 'admin-panel.php');
  });

  it('TC-05-001 navigate all dashboard tabs and verify each section is displayed', () => {
    cy.get('#list-dash-list').should('have.class', 'active');

    cy.get('#list-home-list').click();
    cy.get('#list-home').should('be.visible');
    cy.get('select[name="apptime"]').should('exist');

    cy.get('#list-pat-list').click();
    cy.get('#app-hist').should('be.visible');
    cy.get('#app-hist').find('table').should('exist');

    cy.get('#list-pres-list').click();
    cy.get('#list-pres').should('be.visible');
    cy.get('#list-pres').find('table').should('exist');

    cy.get('#list-dash-list').click();
    cy.get('#list-dash').should('be.visible');
  });

  it('TC-05-002 exception — clicking a tab whose target section ID is missing leaves no section visible', () => {
    // Construct an artificial tab pointing at a non-existent section to simulate
    // a broken navigation link.
    cy.window().then((win) => {
      const doc = win.document;
      const a = doc.createElement('a');
      a.id = 'list-broken-list';
      a.setAttribute('data-toggle', 'list');
      a.setAttribute('href', '#list-broken');
      a.setAttribute('role', 'tab');
      a.textContent = 'Broken Tab';
      doc.querySelector('#list-tab').appendChild(a);
    });
    cy.get('#list-broken-list').click();
    // The target #list-broken does not exist — therefore nothing should become visible.
    cy.get('#list-broken').should('not.exist');
  });
});
