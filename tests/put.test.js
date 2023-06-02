const request = require('supertest');
// Import MongoDB module
const { closeConnection, connect } = require('../model/dbOperations');
const webapp = require('../server');
// import test utilities function
const {
  testUser, testCharity, insertTestDataToDB, deleteTestDataFromDB,
} = require('./testUtils');

let mongo;
let res;
let db;

// TEST PUT ENDPOINT
describe('Update a user endpoint integration test', () => {
  let testUserInserted;

  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();

    // add test user to mongodb
    testUserInserted = await insertTestDataToDB(db, 'users', testUser);
  });

  /**
 * Delete all test data from the DB
 * Close all open connections
 */
  afterAll(async () => {
    await deleteTestDataFromDB(db, 'users', testUserInserted.username);
    try {
      await mongo.close();
      await closeConnection();
      return null;
    } catch (err) {
      return err.message;
    }
  });

  test('Endpoint status code and response async/await', async () => {
    res = await request(webapp).put(`/api/users/${testUserInserted.username}`)
      .send('state=Pennsylvania');
    expect(res.status).toEqual(200);
    expect(res.type).toBe('application/json');

    // change back
    res = await request(webapp).put(`/api/users/${testUserInserted.username}`)
      .send('state=PA');
    expect(res.status).toEqual(200);
    expect(res.type).toBe('application/json');

    // the database was updated
    const updatedUser = await db.collection('users').findOne({ username: testUserInserted.username });
    expect(updatedUser.state).toEqual('PA');
  });
});

// TEST PUT ENDPOINT--charities
describe('Update a charity endpoint integration test', () => {
  let testCharityInfo;

  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();

    testCharityInfo = await insertTestDataToDB(db, 'charities', testCharity);
  });

  /**
 * Delete all test data from the DB
 * Close all open connections
 */
  afterEach(async () => {
    await deleteTestDataFromDB(db, 'charities', testCharityInfo.orgID);
    try {
      await mongo.close();
      await closeConnection();
      return null;
    } catch (err) {
      return err.message;
    }
  });

  test('change the city to Miami', async () => {
    res = await request(webapp).put(`/api/charities/${testCharityInfo.orgID}`)
      .send('city=Miami');
    expect(res.status).toEqual(200);
    expect(res.type).toBe('application/json');

    // the database was updated
    const updatedChar = await db.collection('charities').findOne({ city: 'Miami' });
    expect(updatedChar.rank).toEqual(10);
  });

  test('change charity invalid rank', async () => {
    res = await request(webapp).put('/api/rankedcharities/0')
      .send('city=Miami');
    expect(res.status).toEqual(404);
    expect(res.type).toBe('application/json');
  });
});
