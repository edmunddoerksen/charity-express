describe('Donate', () => {
  it('donates to a charity', () => {
    // cy.visit('http://localhost:3000/');
    cy.visit('https://charity-express-web.herokuapp.com/');

    // test successful login
    cy.get('#username').type('admin');
    cy.get('#pwd').type('admin');
    cy.get('button').click();

    // navigate to description page
    cy.get('a').contains('American Cancer Society').click();

    // navigate to donate page
    cy.get('a').contains('Donate').click();

    // donate 1 item
    cy.get('input[type="range"]').as('slider');
    cy.get('@slider')
      .first()
      .scrollIntoView()
      .invoke('val', 100)
      .trigger('change', { force: true });
    // cy.get('input[type="range"]').as('slider')
    //   .first()
    //   .then(($slider) => {
    //     cy.wrap($slider).invoke('val', 50).trigger('change', { force: true });
    //   });
    // cy.get('input[type="range"]').first().invoke('val', 50).trigger('change', { force: true })
      
    cy.get('button').contains('Submit Donation').click();

    // success donation
    cy.contains('thanks you for your generosity').should('be.visible');

    // pass it forward
    cy.get('#outlined-basic').type('tindo');
    cy.get('#outlined-multiline-flexible').type('your turn!');
    cy.get('button').contains('Send message').click();

    // redirect to search charities page
    cy.get('#searchbar');
    cy.contains('Search').should('be.visible');
    cy.get('button');
  });
});
