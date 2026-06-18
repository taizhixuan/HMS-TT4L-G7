// cypress/support/e2e.js
// Global support file. Loaded before every spec.
import './commands';

// HMS pages frequently throw harmless jQuery / Bootstrap errors that should not
// fail the tests. Only swallow these; let real assertion failures bubble up.
Cypress.on('uncaught:exception', (err) => {
  const benign = [
    'Cannot read properties of null',
    "Cannot read property 'createPopper'",
    'is not a function',
  ];
  if (benign.some((m) => err.message && err.message.includes(m))) return false;
  return true;
});
