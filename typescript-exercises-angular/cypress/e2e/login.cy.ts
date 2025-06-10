describe('Test logowania', () => {
  it('Loguje użytkownika Wojtek i weryfikuje powitanie', () => {
    cy.visit('http://localhost:4200');

    cy.contains('mat-label', 'Login')
      .parents('mat-form-field')
      .find('input')
      .type('wojtek');

    cy.contains('mat-label', 'Hasło')
      .parents('mat-form-field')
      .find('input')
      .type('password1');

    cy.contains('button', 'zaloguj', { matchCase: false }).click();

    cy.wait(1000);

    cy.get('h1')
      .invoke('text')
      .then((text) => {
        const normalized = text.replace(/\s+/g, ' ').trim();
        expect(normalized).to.contain('Cześć Wojtek, witaj w ManageMe!');
      });
  });
});
