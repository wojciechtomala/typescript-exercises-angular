describe('Dodawanie nowej historyjki w projekcie', () => {
  it('Tworzy nową historyjkę w istniejącym lub nowym projekcie', () => {
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

    cy.contains('a', 'Projekty').click();

    const storyName = `Historyjka ${Date.now()}`;
    const description = 'To jest testowy opis historyjki.';

    cy.get('.project-item').then(($items) => {
      if ($items.length > 0) {
        cy.wrap($items.first()).find('h6').click();
      } else {
        const projectName = `Projekt ${Date.now()}`;

        cy.contains('button', '+ Dodaj projekt').click();
        cy.get('input[formControlName="name"]').type(projectName);
        cy.get('textarea[formControlName="description"]').type(
          'Opis projektu testowego'
        );
        const today = new Date().toISOString().split('T')[0];
        cy.get('input[formControlName="createdAt"]').type(today);
        cy.get('input[formControlName="endDate"]').type(today);
        cy.get('input[formControlName="maxAssignedUsers"]').type('3');
        cy.contains('button', 'Zapisz').click();

        cy.wait(1000);
        cy.contains('h6', projectName).click();
      }
    });

    cy.contains('button', '+ Dodaj nową historyjkę')
      .should('be.visible')
      .click();

    cy.get('input[formControlName="name"]').type(storyName);
    cy.get('textarea[formControlName="description"]').type(description);

    cy.contains('button', 'Zapisz').click();

    cy.wait(1000);
    cy.contains(storyName).should('exist');
  });
});
