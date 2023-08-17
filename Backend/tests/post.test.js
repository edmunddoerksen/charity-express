// import supertest
const request = require('supertest');

// import the function to close the mongodb connection
const { closeConnection, connect } = require('../model/dbOperations');

// import the express server
const webapp = require('../server');

// import test utilities function
const { deleteTestDataFromDB } = require('./testUtils');

// connection to the DB
let mongo;

describe('POST /users endpoint tests', () => {
  let db; // the db
  let response; // the response from our express server

  beforeAll(async () => {
    // connect to the db
    mongo = await connect();
    // get the db
    db = mongo.db();

    // send the request to the API and collect the response
    response = await request(webapp).post('/api/users')
      .send('username=testuserdonator&address=home&state=PA&city=Philly&zip=19104&email=testuserdonator@gmail.com&password=test&dayJoined=1&monthJoined=1&yearJoined=2023');
  });

  /**
 * After running the tests, we need to remove any test data from the DB
 * We need to close the mongodb connection
 */
  afterAll(async () => {
    // we need to clear the DB
    try {
      await deleteTestDataFromDB(db, 'users', 'testuserdonator');
      await mongo.close(); // the test  file connection
      await closeConnection(); // the express connection
      return null;
    } catch (err) {
      return err.message;
    }
  });

  /**
 * Status code and response type
 */
  test('the status code is 201 and response type', () => {
    expect(response.status).toBe(201);
    expect(response.type).toBe('application/json');
  });

  /**
 * response body
 */
  test('the new user is in the returned data', () => {
    expect(JSON.parse(response.text).data.id).not.toBe(undefined);
  });

  test('The new user is in the database', async () => {
    const insertedUser = await db.collection('users').findOne({ username: 'testuserdonator' });
    expect(insertedUser.username).toEqual('testuserdonator');
  });

  test('missing a field 404', async () => {
    const res = await request(webapp).post('/api/users')
      .send('name=testfaileduser');
    expect(res.status).toEqual(404);
  });
});

describe('POST /charities endpoint tests', () => {
  let db; // the db
  let response; // the response from our express server

  beforeAll(async () => {
    // connect to the db
    mongo = await connect();
    // get the db
    db = mongo.db();

    // send the request to the API and collect the response
    response = await request(webapp).post('/api/charities')
      .send('username=testcharityuser&address=home&state=PA&city=Philly&zip=19104&email=testuserdonator@gmail.com&password=test&dayJoined=1&monthJoined=1&yearJoined=2023');
  });

  /**
 * After running the tests, we need to remove any test data from the DB
 * We need to close the mongodb connection
 */
  afterAll(async () => {
    // we need to clear the DB
    try {
      await deleteTestDataFromDB(db, 'charities', 'testcharityuser');
      await mongo.close(); // the test  file connection
      await closeConnection(); // the express connection
      return null;
    } catch (err) {
      return err.message;
    }
  });

  /**
 * Status code and response type
 */
  test('the status code is 201 and response type', () => {
    expect(response.status).toBe(201);
    expect(response.type).toBe('application/json');
  });

  test('The new charity is in the database', async () => {
    const insertedCharity = await db.collection('charities').findOne({ orgname: 'testcharityuser' });
    expect(insertedCharity.orgname).toEqual('testcharityuser');
  });

  test('missing a field 404', async () => {
    const res = await request(webapp).post('/api/charities')
      .send('name=testfailedcharity');
    expect(res.status).toEqual(404);
  });
});

describe('POST /notifications endpoint tests', () => {
  // let db; // the db
  let response; // the response from our express server

  beforeAll(async () => {
    // connect to the db
    mongo = await connect();
    // get the db
    // db = mongo.db();
  });

  /**
 * After running the tests, we need to remove any test data from the DB
 * We need to close the mongodb connection
 */
  afterAll(async () => {
    // we need to clear the DB
    try {
      await mongo.close(); // the test  file connection
      await closeConnection(); // the express connection
      return null;
    } catch (err) {
      return err.message;
    }
  });

  /**
 * Status code and response type
 */
  test('the status code is 201 and response type', async () => {
    // send the request to the API and collect the response
    response = await request(webapp).post('/api/notifications')
      .send('recipientID=1&senderID=423&message=sent&notification=shipping');

    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
  });
});

describe('POST /api/user/checkUniqueness endpoint tests', () => {
  // let db; // the db
  let response; // the response from our express server

  beforeAll(async () => {
    // connect to the db
    mongo = await connect();
    // get the db
    // db = mongo.db();
  });

  /**
 * After running the tests, we need to remove any test data from the DB
 * We need to close the mongodb connection
 */
  afterAll(async () => {
    // we need to clear the DB
    try {
      await mongo.close(); // the test  file connection
      await closeConnection(); // the express connection
      return null;
    } catch (err) {
      return err.message;
    }
  });

  /**
 * Status code and response type
 */
  test('new unique user', async () => {
    // send the request to the API and collect the response
    response = await request(webapp).post('/api/user/checkUniqueness')
      .send('username=newuniqueuser&email=email&type=user');

    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
  });
});
