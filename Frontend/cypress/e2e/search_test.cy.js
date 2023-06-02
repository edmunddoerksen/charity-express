describe('Search', () => {
  it("searches for a charity and visits it's page", () => {
    // cy.visit('http://localhost:3000/');
    cy.visit('https://charity-express-web.herokuapp.com/');

    // test successful login
    cy.get('#username').type('admin');
    cy.get('#pwd').type('admin');
    cy.get('button').click();

    // search for charity
    cy.get('#searchbar').type('fee');
    cy.get('button').contains('Search').click();
    cy.contains('Feeding America').should('be.visible');

    // navigate to description page
    cy.get('a').contains('Feeding America').click();
    cy.contains('Description').should('be.visible');
    cy.contains('Purpose').should('be.visible');
    cy.contains('Location:161 N Clark St. Chicago, IL').should('be.visible');

    // show map
    cy.get('button').eq(2).click();
    cy.get('iframe');

    // show progress
    cy.get('button').eq(3).click();
    cy.contains('Hide Progress').should('be.visible');
    cy.contains('70%').should('be.visible');
    cy.contains('60%').should('be.visible');
    cy.contains('92%').should('be.visible');
  });
});
