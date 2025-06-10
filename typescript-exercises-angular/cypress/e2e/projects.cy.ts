// describe('Test zakładki Projects i dodania nowego projektu', () => {
//   it('Dodaje nowy projekt i weryfikuje jego obecność na liście', () => {
//     cy.visit('http://localhost:4200');

//     cy.contains('mat-label', 'Login')
//       .parents('mat-form-field')
//       .find('input')
//       .type('wojtek');

//     cy.contains('mat-label', 'Hasło')
//       .parents('mat-form-field')
//       .find('input')
//       .type('password1');

//     cy.contains('button', 'zaloguj', { matchCase: false }).click();

//     cy.wait(1000);

//     cy.contains('a', 'Projekty').click();

//     cy.contains('button', '+ Dodaj projekt').click();

//     const randomName = `Projekt ${Date.now()}`;

//     cy.get('input[formControlName="name"]').type(randomName);
//     cy.get('textarea[formControlName="description"]').type(
//       'Opis testowego projektu'
//     );

//     const today = new Date().toISOString().split('T')[0];
//     cy.get('input[formControlName="createdAt"]').type(today);
//     cy.get('input[formControlName="endDate"]').type(today);

//     cy.get('input[formControlName="maxAssignedUsers"]').type('5');

//     cy.contains('button', 'Zapisz').click();

//     cy.wait(1000);

//     cy.contains(randomName).should('exist');
//   });
// });

describe('Test edycji projektu', () => {
  it('Kliknięcie w projekt i edycja jego nazwy', () => {
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

    cy.contains(/^Projekt \d+$/).click();
  });
});
