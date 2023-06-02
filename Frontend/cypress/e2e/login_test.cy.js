describe('Login', () => {
  it('logs a user into the app', () => {
    // cy.visit('http://localhost:3000/');
    cy.visit('https://charity-express-web.herokuapp.com/');

    // test login button is there
    cy.get('button');

    // test login username but no password
    cy.get('#username').type('admin');
    cy.get('button').click();
    cy.contains('Please enter a username and password').should('be.visible');

    // test incorrect username and password combination
    cy.get('#username').clear();
    cy.get('#username').type('admin');
    cy.get('#pwd').clear();
    cy.get('#pwd').type('wrongpassword');
    cy.get('button').click();
    cy.contains('The username or password is incorrect').should('be.visible');

    // test successful login
    cy.get('#username').clear();
    cy.get('#username').type('admin');
    cy.get('#pwd').clear();
    cy.get('#pwd').type('admin');
    cy.get('button').click();
    cy.get('#searchbar');
    cy.contains('Search').should('be.visible');
    cy.get('button');
  });
});
