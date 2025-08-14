/** @type {Cypress.PluginConfig} */
/// <reference types="cypress" />

describe('Страница конструктора бургера — интеграционные тесты', () => {
  beforeEach(() => {
    // Подменяем данные ингредиентов
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('Добавление булки и начинки из списка в конструктор', () => {
    // Добавляем первую булку
    cy.contains('h3', 'Булки')
      .next('ul')
      .find('button')
      .contains('Добавить')
      .first()
      .click();
    // Добавляем первую начинку
    cy.contains('h3', 'Начинки')
      .next('ul')
      .find('button')
      .contains('Добавить')
      .first()
      .click();

    // После добавления булки и начинки в конструкторе не должны показываться подсказки о пустых частях
    cy.contains('Выберите булки').should('not.exist');
    cy.contains('Выберите начинку').should('not.exist');
  });

  it('Открытие и закрытие модального окна ингредиента и проверка данных', () => {
    // Откроем модальное окно первого элемента в категории "Начинки"
    cy.contains('h3', 'Начинки')
      .next('ul')
      .find('a')
      .contains('Биокотлета из марсианской Магнолии')
      .click();

    // В модальном окне должен быть заголовок "Детали ингредиента"
    cy.contains('Детали ингредиента').should('exist');

    // Внутри модального окна должно отображаться имя ингредиента
    cy.get('body')
      .contains('Биокотлета из марсианской Магнолии')
      .should('exist');

    // Закрываем модал клавишей Esc (Modal слушает keydown)
    cy.get('body').type('{esc}');
    cy.contains('Детали ингредиента').should('not.exist');
  });

 it('Создание заказа: сборка, клик по кнопке, проверка модального окна с номером заказа и очистка конструктора', () => {
    // Подменяем данные пользователя и заказ
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as('createOrder');

    // Устанавливаем токены во все возможные места
    cy.setCookie('accessToken', 'Bearer test-access-token');
    cy.window().then(win => {
      win.localStorage.setItem('accessToken', 'Bearer test-access-token');
      win.localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    cy.visit('/');
    cy.wait('@getIngredients');

    // Добавляем булку и начинку
    cy.contains('h3', 'Булки').next('ul').find('button').contains('Добавить').first().click();
    cy.contains('h3', 'Начинки').next('ul').find('button').contains('Добавить').first().click();

    // Оформляем заказ
    cy.contains('Оформить заказ').click();

    // Проверяем, что запрос создания заказа отправлен и вернул 200
    cy.wait('@createOrder').its('response.statusCode').should('eq', 200);

    // Проверяем номер заказа
    cy.contains('85938').should('exist');

    // Закрываем модалку
    cy.get('body').type('{esc}');
    cy.contains('Выберите булки').should('exist');
    cy.contains('Выберите начинку').should('exist');
  });
});
