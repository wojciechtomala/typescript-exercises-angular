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

describe('Edycja historyjki w projekcie', () => {
  it('Edytuje tytuł istniejącej historyjki i weryfikuje zmianę', () => {
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

    cy.get('.project-item').then(($items) => {
      if ($items.length > 0) {
        cy.wrap($items.first()).find('h6').click();
      } else {
        const projectName = `Projekt do edycji story ${Date.now()}`;
        cy.contains('button', '+ Dodaj projekt').click();
        cy.get('input[formControlName="name"]').type(projectName);
        cy.get('textarea[formControlName="description"]').type(
          'Opis projektu testowego do edycji story'
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

    cy.wait(1000);

    cy.get('body').then(($body) => {
      if ($body.find('.story-item').length === 0) {
        cy.contains('button', '+ Dodaj nową historyjkę')
          .should('be.visible')
          .click();
        cy.get('input[formControlName="name"]').type(
          `Historyjka do edycji ${Date.now()}`
        );
        cy.get('textarea[formControlName="description"]').type(
          'Opis do edycji'
        );
        cy.contains('button', 'Zapisz').click();
        cy.wait(1000);
      }
    });

    cy.get('.story-item').first().click();

    const newStoryTitle = `Zmieniona Historyjka ${Date.now()}`;
    cy.get('input[formControlName="name"]').clear().type(newStoryTitle);

    cy.contains('button', 'Zapisz').click();

    cy.wait(1000);

    cy.contains('.story-item', newStoryTitle).should('exist');
  });
});

describe('Usuwanie historyjki z projektu', () => {
  it('Usuwa historyjkę po kliknięciu przycisku usuwania', () => {
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

    cy.get('.project-item').then(($items) => {
      if ($items.length > 0) {
        cy.wrap($items.first()).find('h6').click();
      } else {
        const projectName = `Projekt do usunięcia story ${Date.now()}`;
        cy.contains('button', '+ Dodaj projekt').click();
        cy.get('input[formControlName="name"]').type(projectName);
        cy.get('textarea[formControlName="description"]').type(
          'Opis projektu testowego do usunięcia story'
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

    cy.wait(1000);

    cy.get('body').then(($body) => {
      if ($body.find('.story-item').length === 0) {
        cy.contains('button', '+ Dodaj nową historyjkę')
          .should('be.visible')
          .click();
        cy.get('input[formControlName="name"]').type(
          `Historyjka do usunięcia ${Date.now()}`
        );
        cy.get('textarea[formControlName="description"]').type(
          'Opis historyjki do usunięcia'
        );
        cy.contains('button', 'Zapisz').click();
        cy.wait(1000);
      }
    });

    let storyTitleToDelete;
    cy.get('.story-item')
      .first()
      .find('.story-title h6')
      .invoke('text')
      .then((text) => {
        storyTitleToDelete = text.trim();
        cy.get('.story-item').first().find('.delete-btn').click();

        cy.wait(1000);

        cy.contains('.story-item', storyTitleToDelete).should('not.exist');
      });
  });
});
