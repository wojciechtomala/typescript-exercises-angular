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

describe('Tworzenie zadania po dodaniu historyjki', () => {
  it('Dodaje zadanie do istniejącej historyjki', () => {
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

    cy.visit('http://localhost:4200');
    cy.contains('a', 'Zadania').click();

    cy.contains('button', '+ Dodaj zadanie').click();

    const taskTitle = `Zadanie ${Date.now()}`;
    const taskDescription = 'Opis testowego zadania';

    cy.get('input[formControlName="title"]').type(taskTitle);
    cy.get('textarea[formControlName="description"]').type(taskDescription);

    cy.get('mat-select[formControlName="estimatedWorkHours"]').click({
      force: true,
    });
    cy.get('mat-option')
      .contains(/1|3|5|8/)
      .click({ force: true });

    cy.get('mat-select[formControlName="state"]').click({ force: true });
    cy.get('mat-option').then((options) => {
      cy.wrap(options[Math.floor(Math.random() * options.length)]).click({
        force: true,
      });
    });

    cy.get('mat-select[formControlName="storyId"]').click({ force: true });
    cy.wait(1000);
    cy.get('mat-option', { timeout: 5000 }).first().click({ force: true });

    cy.wait(1000);

    cy.contains('button', 'Zapisz').click();

    cy.wait(1000);
    cy.get('.task-item').contains(taskTitle).should('exist');
  });
});
