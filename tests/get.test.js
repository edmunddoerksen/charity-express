const request = require('supertest');
const jwt = require('jsonwebtoken');
const { closeConnection, connect } = require('../model/dbOperations');
const webapp = require('../server');

// import test utilities function
const {
  isInUserArray, isInOrgArray, testUser, testCharity, insertTestDataToDB, deleteTestDataFromDB,
} = require('./testUtils');

let mongo; // reference to the database
let db;

// TEST GET ENDPOINT for Users
describe('GET student(s) endpoint integration test', () => {
  let testUsername;
  let testUserInfo;

  beforeAll(async () => { // connect to the database and insert the test data
    mongo = await connect();
    db = mongo.db();

    testUserInfo = await insertTestDataToDB(db, 'users', testUser);

    testUsername = testUserInfo.username;
  });
  /**
 * Delete all test data from the DB
 * Close all open connections
 */
  afterAll(async () => {
    await deleteTestDataFromDB(db, 'users', testUsername);
    try {
      await mongo.close();
      await closeConnection(); // mongo client that started server.
      return null;
    } catch (err) {
      return err.message;
    }
  });

  test('Get all users endpoint status code and data', async () => {
    const resp = await request(webapp).get('/api/users/'); // send the request and test response
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');

    const userArr = JSON.parse(resp.text).data; // extract data from response
    expect(isInUserArray(userArr, testUsername)).toBe(true);
  });

  test('Get a user endpoint status code and data', async () => {
    const resp = await request(webapp).get(`/api/users/${testUsername}`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const studArr = JSON.parse(resp.text).data;
    const { _id: insertedId, ...data } = studArr;
    const { _id: userId, ...expected } = testUser;
    expect(data).toMatchObject(expected);
  });

  test('user not in db status code 404', async () => {
    const resp = await request(webapp).get('/api/users/1');
    expect(resp.status).toEqual(404);
    expect(resp.type).toBe('application/json');
  });
});

// TEST GET ENDPOINT for Charities
describe('GET charities endpoint integration test', () => {
  let testOrgID;
  let testCharityInfo;
  // let testRank;

  beforeEach(async () => { // connect to the database and insert the test data
    mongo = await connect();
    db = mongo.db();

    testCharityInfo = await insertTestDataToDB(db, 'charities', testCharity);

    testOrgID = testCharityInfo.orgID;
    // testRank = testCharityInfo.rank;
  });

  /**
 * Delete all test data from the DB
 * Close all open connections
 */
  afterEach(async () => {
    await deleteTestDataFromDB(db, 'charities', testOrgID);
    try {
      await mongo.close();
      await closeConnection(); // mongo client that started server.
      return null;
    } catch (err) {
      return err.message;
    }
  });

  test('Get all charities endpoint status code and data', async () => {
    const resp = await request(webapp).get('/api/charities/'); // send the request and test response
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');

    const charityArr = JSON.parse(resp.text).data; // extract data from response
    expect(isInOrgArray(charityArr, testOrgID)).toBe(true);
  });

  test('Get charity by ID test: successful retrieval', async () => {
    const resp = await request(webapp).get(`/api/charities/${testOrgID}`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const charityInfo = JSON.parse(resp.text).data;
    const { _id: insertedId, ...data } = charityInfo;
    const { _id: userId, ...expected } = testCharity;
    expect(data).toMatchObject(expected);
  });

  test('Get charity by rank test: successful retrieval', async () => {
    const resp = await request(webapp).get('/api/rankedcharities/1');
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const charityInfo = JSON.parse(resp.text).data;
    expect(charityInfo.orgID).toBe('redcross');
  });

  test('charity not in db status code 404', async () => {
    const resp = await request(webapp).get('/api/charities/nothere');
    expect(resp.status).toEqual(404);
    expect(resp.type).toBe('application/json');
  });

  test('charity not in db when queried by rank status code 404', async () => {
    const resp = await request(webapp).get('/api/rankedcharities/0');
    expect(resp.status).toEqual(404);
    expect(resp.type).toBe('application/json');
  });
});

// TEST GET ENDPOINT for get user profile
describe('GET user profile endpoint integration test', () => {
  let testUserInfo;

  beforeAll(async () => { // connect to the database and insert the test data
    mongo = await connect();
    db = mongo.db();

    testUserInfo = await insertTestDataToDB(db, 'users', testUser);
  });
  /**
 * Delete all test data from the DB
 * Close all open connections
 */
  afterAll(async () => {
    await deleteTestDataFromDB(db, 'users', testUserInfo.username);
    try {
      await mongo.close();
      await closeConnection(); // mongo client that started server.
      return null;
    } catch (err) {
      return err.message;
    }
  });

  test('getting user profile fails when no authorization token provided', async () => {
    const resp = await request(webapp).get('/api/getUserProfile');
    expect(resp.status).toEqual(401);
    expect(resp.type).toBe('application/json');
  });

  test('getting user profile fails when authorization token is invalid', async () => {
    const resp = await request(webapp).get('/api/getUserProfile').set('Authorization', 'invalid-token-value');
    expect(resp.status).toEqual(400);
    expect(resp.type).toBe('application/json');
  });

  test('getting user profile when authorization token is valid', async () => {
    const token = jwt.sign(
      {
        username: testUserInfo.username,
        password: testUserInfo.password,
      },
      process.env.KEY,

      { expiresIn: '1h' },
    );
    const resp = await request(webapp).get('/api/getUserProfile').set('Authorization', token);
    expect(JSON.parse(resp.text).profile.username).toEqual(testUserInfo.username);
    expect(resp.status).toEqual(201);
    expect(resp.type).toBe('application/json');
  });
});

// TEST GET ENDPOINT for notifications
describe('GET notifications endpoint integration test', () => {
  beforeAll(async () => { // connect to the database and insert the test data
    mongo = await connect();
    db = mongo.db();
  });
  /**
 * Delete all test data from the DB
 * Close all open connections
 */
  afterAll(async () => {
    try {
      await mongo.close();
      await closeConnection(); // mongo client that started server.
      return null;
    } catch (err) {
      return err.message;
    }
  });

  test('getting notifications for user', async () => {
    const resp = await request(webapp).get('/api/notifications?userId=1');
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
  });
});

// TEST GET ENDPOINT for login
describe('GET login endpoint integration test', () => {
  let testUserInfo;

  beforeAll(async () => { // connect to the database and insert the test data
    mongo = await connect();
    db = mongo.db();

    testUserInfo = await insertTestDataToDB(db, 'users', testUser);
  });
  /**
 * Delete all test data from the DB
 * Close all open connections
 */
  afterAll(async () => {
    await deleteTestDataFromDB(db, 'users', testUserInfo.username);
    try {
      await mongo.close();
      await closeConnection(); // mongo client that started server.
      return null;
    } catch (err) {
      return err.message;
    }
  });

  test('getting user login fails when no authorization token provided', async () => {
    const resp = await request(webapp).get('/api/login');
    expect(resp.status).toEqual(401);
    expect(resp.type).toBe('application/json');
  });

  test('getting user login fails when authorization token is invalid', async () => {
    const resp = await request(webapp).get('/api/login').set('Authorization', 'invalid-token-value');
    expect(resp.status).toEqual(401);
    expect(resp.type).toBe('application/json');
  });

  test('getting user profile when authorization token is valid', async () => {
    const token = jwt.sign(
      {
        username: testUserInfo.username,
        password: testUser.password,
      },
      process.env.KEY,

      { expiresIn: '1h' },
    );
    const resp = await request(webapp).get('/api/login').set('Authorization', token);
    const decoded = jwt.verify(JSON.parse(resp.text).apptoken, process.env.KEY);
    expect(decoded.username).toEqual(testUserInfo.username);
    expect(resp.status).toEqual(201);
    expect(resp.type).toBe('application/json');
  });
});

// TEST GET ENDPOINT for notifications
describe('GET notifications endpoint integration test', () => {
  beforeAll(async () => { // connect to the database and insert the test data
    mongo = await connect();
    db = mongo.db();
  });
  /**
 * Delete all test data from the DB
 * Close all open connections
 */
  afterAll(async () => {
    try {
      await mongo.close();
      await closeConnection(); // mongo client that started server.
      return null;
    } catch (err) {
      return err.message;
    }
  });

  test('getting notifications for user', async () => {
    const resp = await request(webapp).get('/notifications?userId=1');
    expect(resp.status).toEqual(200);
    // expect(resp.type).toBe('application/json');
  });
});

// TEST GET ENDPOINT for login
describe('GET login endpoint integration test', () => {
  let testUserInfo;

  beforeAll(async () => { // connect to the database and insert the test data
    mongo = await connect();
    db = mongo.db();

    testUserInfo = await insertTestDataToDB(db, 'users', testUser);
  });
  /**
 * Delete all test data from the DB
 * Close all open connections
 */
  afterAll(async () => {
    await deleteTestDataFromDB(db, 'users', testUserInfo.username);
    try {
      await mongo.close();
      await closeConnection(); // mongo client that started server.
      return null;
    } catch (err) {
      return err.message;
    }
  });

  test('getting user login fails when no authorization token provided', async () => {
    const resp = await request(webapp).get('/api/login');
    expect(resp.status).toEqual(401);
    expect(resp.type).toBe('application/json');
  });

  test('getting user login fails when authorization token is invalid', async () => {
    const resp = await request(webapp).get('/api/login').set('Authorization', 'invalid-token-value');
    expect(resp.status).toEqual(401);
    expect(resp.type).toBe('application/json');
  });

  test('getting user profile when authorization token is valid', async () => {
    const token = jwt.sign(
      {
        username: testUserInfo.username,
        password: testUser.password,
      },
      process.env.KEY,

      { expiresIn: '1h' },
    );
    const resp = await request(webapp).get('/api/login').set('Authorization', token);
    const decoded = jwt.verify(JSON.parse(resp.text).apptoken, process.env.KEY);
    expect(decoded.username).toEqual(testUserInfo.username);
    expect(resp.status).toEqual(201);
    expect(resp.type).toBe('application/json');
  });
});