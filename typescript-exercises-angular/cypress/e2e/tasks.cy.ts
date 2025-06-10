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

describe('Modyfikacja przypisanej osoby w zadaniu', () => {
  it('Loguje się, wybiera zadanie i zmienia przypisaną osobę', () => {
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

    cy.contains('a', 'Zadania').click();

    cy.get('body').then(($body) => {
      if ($body.find('.task-item').length === 0) {
        cy.log('Brak zadań, tworzę nowe zadanie...');
        cy.contains('button', '+ Dodaj zadanie').click();

        const taskTitle = `Nowe Zadanie ${Date.now()}`;
        const taskDescription = 'Opis nowo utworzonego zadania.';

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
        cy.contains('h3', taskTitle).click();
      } else {
        cy.log('Istniejące zadania, wybieram pierwsze...');
        cy.get('.task-item').first().find('h3').click();
      }
    });

    cy.wait(1000);

    cy.contains('mat-label', 'Zmień przypisaną osobę')
      .parents('mat-form-field')
      .find('mat-select')
      .click({ force: true });

    cy.wait(500);

    cy.get('mat-option').then(($options) => {
      if ($options.length >= 2) {
        cy.wrap($options.eq(1)).click({ force: true });
      } else {
        cy.log(
          'Brak co najmniej dwóch osób do przypisania, wybieram pierwszą (jeśli istnieje).'
        );
        if ($options.length > 0) {
          cy.wrap($options.eq(0)).click({ force: true });
        } else {
          cy.log('Brak osób do przypisania w rozwijanej liście.');
        }
      }
    });

    cy.wait(1000);
    cy.contains('h3', 'Doing').should('be.visible');
    cy.log('Pomyślnie zmieniono przypisaną osobę.');
  });
});

describe('Edycja zadania', () => {
  it('Edytuje istniejące zadanie i weryfikuje zaktualizowaną nazwę', () => {
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

    cy.contains('a', 'Zadania').click();
    cy.wait(1000);

    cy.get('body').then(($body) => {
      if ($body.find('.task-item').length === 0) {
        cy.log('Brak zadań, tworzę nowe zadanie do edycji...');
        cy.contains('button', '+ Dodaj zadanie').click();

        const initialTaskTitle = `Zadanie do edycji ${Date.now()}`;
        const taskDescription = 'Opis początkowego zadania.';

        cy.get('input[formControlName="title"]').type(initialTaskTitle);
        cy.get('textarea[formControlName="description"]').type(taskDescription);

        cy.get('mat-select[formControlName="estimatedWorkHours"]').click({
          force: true,
        });
        cy.get('mat-option').contains('3').click({ force: true });

        cy.get('mat-select[formControlName="state"]').click({ force: true });
        cy.get('mat-option').first().click({ force: true });

        cy.get('mat-select[formControlName="storyId"]').click({ force: true });
        cy.wait(500);
        cy.get('mat-option', { timeout: 5000 }).first().click({ force: true });

        cy.contains('button', 'Zapisz').click();
        cy.wait(1000);
        cy.get('.task-item').contains(initialTaskTitle).should('exist');
      }
    });

    cy.get('.task-item').first().find('.edit-btn').click();

    const updatedTaskTitle = `Zaktualizowane Zadanie ${Date.now()}`;
    cy.get('input[formControlName="title"]').clear().type(updatedTaskTitle);

    cy.contains('mat-dialog-actions button', 'Zapisz').click();

    cy.wait(1000);

    cy.get('.task-item').contains(updatedTaskTitle).should('exist');
    cy.log(`Zadanie zostało pomyślnie edytowane na: "${updatedTaskTitle}"`);
  });
});

describe('Usuwanie zadania', () => {
  it('Usuwa zadanie z listy i weryfikuje jego zniknięcie', () => {
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

    cy.contains('a', 'Zadania').click();
    cy.wait(1000);

    let taskTitleToDelete: string;
    cy.get('body').then(($body) => {
      if ($body.find('.task-item').length === 0) {
        cy.log('Brak zadań, tworzę nowe zadanie do usunięcia...');
        cy.contains('button', '+ Dodaj zadanie').click();

        taskTitleToDelete = `Zadanie do usunięcia ${Date.now()}`;
        const taskDescription = 'Opis zadania do usunięcia.';

        cy.get('input[formControlName="title"]').type(taskTitleToDelete);
        cy.get('textarea[formControlName="description"]').type(taskDescription);

        cy.get('mat-select[formControlName="estimatedWorkHours"]').click({
          force: true,
        });
        cy.get('mat-option').contains('5').click({ force: true });

        cy.get('mat-select[formControlName="state"]').click({ force: true });
        cy.get('mat-option').first().click({ force: true });

        cy.get('mat-select[formControlName="storyId"]').click({ force: true });
        cy.wait(500);
        cy.get('mat-option', { timeout: 5000 }).first().click({ force: true });

        cy.contains('button', 'Zapisz').click();
        cy.wait(1000);
        cy.get('.task-item').contains(taskTitleToDelete).should('exist');
      } else {
        cy.get('.task-item')
          .first()
          .find('h3')
          .invoke('text')
          .then((text) => {
            taskTitleToDelete = text.trim();
          });
      }
    });

    cy.then(() => {
      cy.contains('.task-item', taskTitleToDelete).find('.delete-btn').click();

      cy.on('window:confirm', (str) => {
        expect(str).to.equal('Czy napewno chcesz usunąć zadanie?');
        return true;
      });

      cy.wait(1000);

      cy.get('.task-item').contains(taskTitleToDelete).should('not.exist');
      cy.log(`Zadanie "${taskTitleToDelete}" zostało pomyślnie usunięte.`);
    });
  });
});
