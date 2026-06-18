// cypress/support/commands.js
// Custom Cypress commands shared across HMS test specs.

// ---------- Test-helper endpoint commands ----------

Cypress.Commands.add('hmsReset', (action = 'full_reset') => {
  return cy.request({
    url: `/_test_helpers.php?action=${action}`,
    failOnStatusCode: false,
  }).then((resp) => {
    expect(resp.status, `_test_helpers.php (${action})`).to.eq(200);
    expect(resp.body.ok, JSON.stringify(resp.body)).to.eq(true);
    return resp.body;
  });
});

// ---------- Alert capture helpers ----------
// HMS shows results via blocking JS alert() then sometimes redirects via
// window.location.href. Cypress auto-accepts alerts; we just record the text.

Cypress.Commands.add('captureAlerts', () => {
  const log = [];
  cy.window().then((win) => {
    const orig = win.alert;
    win.alert = (msg) => {
      log.push(String(msg));
      // Do NOT call orig — we don't want a blocking dialog.
    };
    return cy.wrap(log).as('alertLog');
  });
});

Cypress.Commands.add('expectAlertContains', (substring) => {
  cy.get('@alertLog', { timeout: 10000 }).should((log) => {
    const joined = log.join(' | ');
    expect(joined, `alerts seen: ${joined}`).to.contain(substring);
  });
});

Cypress.Commands.add('expectNoAlertContaining', (substring) => {
  cy.get('@alertLog').then((log) => {
    const joined = log.join(' | ');
    expect(joined, `alerts seen: ${joined}`).to.not.contain(substring);
  });
});

// ---------- Registration form helpers ----------

Cypress.Commands.add('visitHome', () => {
  cy.visit('/');
  cy.captureAlerts();
});

Cypress.Commands.add('fillRegistration', (data) => {
  const d = {
    fname: 'test',
    lname: 'temp',
    gender: 'Male',
    email: 'kenny@gmail.com',
    contact: '0123456789',
    password: 'kenny123',
    cpassword: 'kenny123',
    ...data,
  };
  cy.get('input[name="fname"]').clear().type(d.fname);
  cy.get('input[name="lname"]').clear().type(d.lname);
  cy.get(`input[name="gender"][value="${d.gender}"]`).check({ force: true });
  cy.get('input[name="email"]').clear().type(d.email);

  // Contact field has maxlength=10. To test boundary "> 10 digits" we must
  // bypass the maxlength constraint, so use jQuery .val() then trigger input.
  cy.get('input[name="contact"]').then(($el) => {
    cy.wrap($el).clear();
    if (d.contact && d.contact.length > 10) {
      cy.wrap($el).invoke('removeAttr', 'maxlength').invoke('val', d.contact).trigger('input').trigger('change');
    } else if (d.contact) {
      cy.wrap($el).type(d.contact);
    }
  });

  cy.get('input[name="password"]').clear().type(d.password);
  cy.get('input[name="cpassword"]').clear().type(d.cpassword);
});

Cypress.Commands.add('submitRegistration', () => {
  cy.get('input[name="patsub1"]').click();
});

// ---------- Login helpers ----------

Cypress.Commands.add('loginAsPatientFromIndex1', (email, password) => {
  cy.visit('/index1.php');
  cy.captureAlerts();
  if (email !== undefined) cy.get('input[name="email"]').clear().type(email);
  if (password !== undefined) cy.get('input[name="password2"]').clear().type(password);
  cy.get('input[name="patsub"]').click();
});

Cypress.Commands.add('loginAsDoctor', (username, password) => {
  cy.visit('/');
  cy.captureAlerts();
  cy.get('#profile-tab').click();
  if (username !== undefined) cy.get('input[name="username3"]').clear().type(username);
  if (password !== undefined) cy.get('input[name="password3"]').clear().type(password);
  cy.get('input[name="docsub1"]').click();
});

Cypress.Commands.add('logout', () => {
  cy.get('a[href="logout.php"]').first().click();
});

// ---------- Appointment booking helpers ----------

Cypress.Commands.add('openBookingTab', () => {
  cy.get('#list-home-list').click();
  cy.get('#list-home').should('be.visible');
});

Cypress.Commands.add('bookAppointment', (opts) => {
  const o = {
    spec: undefined,
    doctor: undefined,
    date: undefined, // YYYY-MM-DD
    time: '08:00:00',
    ...opts,
  };
  cy.openBookingTab();
  if (o.spec) cy.get('select[name="spec"]').select(o.spec);
  if (o.doctor) cy.get('select[name="doctor"]').select(o.doctor, { force: true });
  if (o.date) cy.get('input[name="appdate"]').clear().type(o.date);
  if (o.time) cy.get('select[name="apptime"]').select(o.time);
  cy.get('input[name="app-submit"]').click();
});

// ---------- Date helpers ----------

Cypress.Commands.add('dateOffset', (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const iso = d.toISOString().slice(0, 10);
  return cy.wrap(iso);
});
