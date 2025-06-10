describe('Test zakładki Projects i dodania nowego projektu', () => {
  it('Dodaje nowy projekt i weryfikuje jego obecność na liście', () => {
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

    cy.contains('button', '+ Dodaj projekt').click();

    const randomName = `Projekt ${Date.now()}`;

    cy.get('input[formControlName="name"]').type(randomName);
    cy.get('textarea[formControlName="description"]').type(
      'Opis testowego projektu'
    );

    const today = new Date().toISOString().split('T')[0];
    cy.get('input[formControlName="createdAt"]').type(today);
    cy.get('input[formControlName="endDate"]').type(today);

    cy.get('input[formControlName="maxAssignedUsers"]').type('5');

    cy.contains('button', 'Zapisz').click();

    cy.wait(1000);

    cy.contains(randomName).should('exist');
  });
});

describe('Test edycji projektu i weryfikacja zaktualizowanej nazwy (kliknięcie w przycisk edycji)', () => {
  it('Edytuje istniejący projekt i weryfikuje zaktualizowaną nazwę na liście, używając przycisku edycji', () => {
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

    cy.wait(1000);

    cy.contains('button', '+ Dodaj projekt').click();

    const initialProjectName = `Projekt do edycji ${Date.now()}`;

    cy.get('input[formControlName="name"]').type(initialProjectName);
    cy.get('textarea[formControlName="description"]').type(
      'Opis projektu do edycji'
    );

    const today = new Date().toISOString().split('T')[0];
    cy.get('input[formControlName="createdAt"]').type(today);
    cy.get('input[formControlName="endDate"]').type(today);

    cy.get('input[formControlName="maxAssignedUsers"]').type('10');

    cy.contains('button', 'Zapisz').click();

    cy.wait(1000);

    cy.contains(initialProjectName).should('exist');

    cy.contains('.project-item', initialProjectName)
      .find('.edit-project-btn')
      .click();

    cy.wait(1000);

    const updatedProjectName = `Projekt po edycji ${Date.now()}`;

    cy.get('input[formControlName="name"]').clear().type(updatedProjectName);

    cy.contains('button', 'Zapisz').click();

    cy.wait(1000);

    cy.contains(updatedProjectName).should('exist');

    cy.contains(initialProjectName).should('not.exist');
  });
});

describe('Test usuwania projektu i weryfikacja jego braku na liście', () => {
  it('Dodaje projekt, a następnie usuwa go i weryfikuje jego brak na liście', () => {
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

    cy.wait(1000);

    cy.contains('button', '+ Dodaj projekt').click();

    const projectToDeleteName = `Projekt do usunięcia ${Date.now()}`;

    cy.get('input[formControlName="name"]').type(projectToDeleteName);
    cy.get('textarea[formControlName="description"]').type(
      'Opis projektu do usunięcia'
    );

    const today = new Date().toISOString().split('T')[0];
    cy.get('input[formControlName="createdAt"]').type(today);
    cy.get('input[formControlName="endDate"]').type(today);

    cy.get('input[formControlName="maxAssignedUsers"]').type('1');

    cy.contains('button', 'Zapisz').click();

    cy.wait(1000);

    cy.contains(projectToDeleteName).should('exist');

    cy.contains('.project-item', projectToDeleteName)
      .find('.delete-btn')
      .click({ force: true });

    cy.wait(1000);

    cy.contains(projectToDeleteName).should('not.exist');
  });
});
