describe('Registration', () => {
  const testuser = 'teste2euser';

  afterEach(() => {
    cy.task('deleteUser', testuser);
  });

  it('creates a new user account', () => {
    // cy.visit('http://localhost:3000/');
    cy.visit('https://charity-express-web.herokuapp.com/');

    // navigate to account registration page
    cy.get('a').contains('Create a user account').click();
    cy.contains('Create account').should('be.visible');

    // missing info
    cy.get('#usr').type(testuser);
    cy.get('button').contains('Create an account').click();
    cy.contains('Please fill out all fields');

    // existing email
    cy.get('#email').type('lol');
    cy.get('#pwd').type('testpassword');
    cy.get('#addr').type('1 Philly Way');
    cy.get('#state').type('PA');
    cy.get('#city').type('Philadelphia');
    cy.get('#zip').type('19104');
    cy.get('input[type="radio"][value="user"]').check();
    cy.get('button').contains('Create an account').click();
    cy.contains('The email is already associated with another account');

    // valid email
    cy.get('#email').clear();
    cy.get('#email').type('teste2euser@gmail.com');
    cy.get('button').contains('Create an account').click();

    // successful user registration
    cy.contains('Successful!').click();
  });
});
