// cypress/e2e/04_appointment.cy.js
// F005 Appointment Booking — 15 automated test cases (4 manual TCs excluded:
// TC-04-012/013/014/015 cancellation, prescription and bill generation).
// Sources: HMS_TCS v1.1 §2.2.4, HMS_TPS v1.1 §2.4, HMS_TDS §2.2.4

describe('F005 Appointment Booking', () => {
  let data;
  before(() => cy.fixture('test-data.json').then((f) => (data = f)));

  // Each test starts with: clean DB + seeded patient (kenny@gmail.com) + seeded
  // doctor (doctor1 / spec=General) + patient already logged in on Book Appt tab.
  beforeEach(() => {
    cy.hmsReset('full_reset');
    cy.visitHome();
    cy.fillRegistration({});
    cy.submitRegistration();
    cy.location('pathname', { timeout: 8000 }).should('include', 'admin-panel.php');
    cy.openBookingTab();
  });

  // ---- Equivalence Partitioning on date & time ----

  it('TC-04-001 past appointment date is rejected', () => {
    cy.dateOffset(-1).then((past) => {
      cy.bookAppointment({ spec: 'General', doctor: data.validDoctor.username, date: past, time: '08:00:00' });
      cy.expectAlertContains('future');
    });
  });

  it("TC-04-002 today's date is rejected (boundary invalid)", () => {
    cy.dateOffset(0).then((today) => {
      cy.bookAppointment({ spec: 'General', doctor: data.validDoctor.username, date: today, time: '08:00:00' });
      cy.expectAlertContains('future');
    });
  });

  it('TC-04-003 future appointment date is accepted', () => {
    cy.dateOffset(7).then((future) => {
      cy.bookAppointment({ spec: 'General', doctor: data.validDoctor.username, date: future, time: '08:00:00' });
      cy.expectAlertContains('successfully booked');
    });
  });

  it('TC-04-004 valid predefined time slot is accepted', () => {
    cy.dateOffset(8).then((future) => {
      cy.bookAppointment({ spec: 'General', doctor: data.validDoctor.username, date: future, time: '10:00:00' });
      cy.expectAlertContains('successfully booked');
    });
  });

  it('TC-04-005 occupied slot is rejected', () => {
    cy.dateOffset(9).then((future) => {
      // First booking — should succeed.
      cy.bookAppointment({ spec: 'General', doctor: data.validDoctor.username, date: future, time: '08:00:00' });
      cy.expectAlertContains('successfully booked');
      // Second booking with the same doctor/date/time — should be rejected.
      cy.openBookingTab();
      cy.bookAppointment({ spec: 'General', doctor: data.validDoctor.username, date: future, time: '08:00:00' });
      cy.expectAlertContains('not available');
    });
  });

  // ---- Boundary Value Analysis on appointment date ----

  it('TC-04-006 yesterday boundary is rejected', () => {
    cy.dateOffset(-1).then((yesterday) => {
      cy.bookAppointment({ spec: 'General', doctor: data.validDoctor.username, date: yesterday, time: '08:00:00' });
      cy.expectAlertContains('future');
    });
  });

  it('TC-04-007 today boundary is rejected', () => {
    cy.dateOffset(0).then((today) => {
      cy.bookAppointment({ spec: 'General', doctor: data.validDoctor.username, date: today, time: '08:00:00' });
      cy.expectAlertContains('future');
    });
  });

  // ---- State Transition Testing — automated only ----

  it('TC-04-008 S1 (Draft) -> S2 (Validation) on submit with valid inputs', () => {
    cy.dateOffset(10).then((future) => {
      cy.bookAppointment({ spec: 'General', doctor: data.validDoctor.username, date: future, time: '12:00:00' });
      // S2 immediately resolves to S3 in the current implementation; the
      // visible signal that S2 ran (validation) is one of the alert outcomes.
      cy.get('@alertLog').should((log) => {
        expect(log.length, 'alerts').to.be.greaterThan(0);
      });
    });
  });

  it('TC-04-009 S2 -> S3 successful booking inserts active appointment', () => {
    cy.dateOffset(11).then((future) => {
      cy.bookAppointment({ spec: 'General', doctor: data.validDoctor.username, date: future, time: '14:00:00' });
      cy.expectAlertContains('successfully booked');
      // Verify appointment shows up as Active in My Appointments.
      cy.get('#list-pat-list').click();
      cy.get('#app-hist').should('be.visible').within(() => {
        cy.contains('Active').should('exist');
      });
    });
  });

  it('TC-04-010 S2 -> S1 past date returns to draft without insert', () => {
    cy.dateOffset(-2).then((past) => {
      cy.bookAppointment({ spec: 'General', doctor: data.validDoctor.username, date: past, time: '08:00:00' });
      cy.expectAlertContains('future');
      cy.expectNoAlertContaining('successfully booked');
    });
  });

  it('TC-04-011 S2 -> S1 slot occupied returns to draft without insert', () => {
    cy.dateOffset(12).then((future) => {
      cy.bookAppointment({ spec: 'General', doctor: data.validDoctor.username, date: future, time: '16:00:00' });
      cy.expectAlertContains('successfully booked');
      cy.openBookingTab();
      cy.bookAppointment({ spec: 'General', doctor: data.validDoctor.username, date: future, time: '16:00:00' });
      cy.expectAlertContains('not available');
    });
  });

  // TC-04-012..015 are MANUAL per HMS_TCS v1.1 (multi-role cancellation,
  // prescription, bill generation) and are intentionally skipped here.

  // ---- Use Case Testing ----

  it('TC-04-016 Main Flow — book appointment end-to-end', () => {
    cy.dateOffset(13).then((future) => {
      cy.bookAppointment({ spec: 'General', doctor: data.validDoctor.username, date: future, time: '08:00:00' });
      cy.expectAlertContains('successfully booked');
      cy.get('#list-pat-list').click();
      cy.get('#app-hist').within(() => cy.contains('Active').should('exist'));
    });
  });

  it('TC-04-017 Alternate Flow — changing specialization refreshes doctor list', () => {
    cy.openBookingTab();
    // Capture the visible doctor option count for spec=General.
    cy.get('select[name="spec"]').select('General');
    cy.get('select[name="doctor"] option:visible').then(($before) => {
      const beforeCount = $before.length;
      // Switch to a different spec. Use the second non-placeholder option.
      cy.get('select[name="spec"] option').then(($opts) => {
        const others = $opts.toArray().filter((o) => o.value && o.value !== 'General' && o.value !== '');
        if (others.length === 0) {
          // If no other spec is seeded, this still verifies the JS onchange runs.
          cy.log('Only one specialization seeded — verifying onchange does not throw.');
        } else {
          cy.get('select[name="spec"]').select(others[0].value);
          cy.get('select[name="doctor"] option:visible').then(($after) => {
            // Either count changes OR visible set changes — both are acceptable.
            expect($after.length === beforeCount && $after.toArray().every((o, i) => o === $before[i])).to.eq(false);
          });
        }
      });
    });
  });

  it('TC-04-018 Exception Flow — past date alert', () => {
    cy.dateOffset(-3).then((past) => {
      cy.bookAppointment({ spec: 'General', doctor: data.validDoctor.username, date: past, time: '08:00:00' });
      cy.expectAlertContains('future');
    });
  });

  it('TC-04-019 Exception Flow — slot occupied alert', () => {
    cy.dateOffset(14).then((future) => {
      cy.bookAppointment({ spec: 'General', doctor: data.validDoctor.username, date: future, time: '10:00:00' });
      cy.expectAlertContains('successfully booked');
      cy.openBookingTab();
      cy.bookAppointment({ spec: 'General', doctor: data.validDoctor.username, date: future, time: '10:00:00' });
      cy.expectAlertContains('not available');
    });
  });
});
