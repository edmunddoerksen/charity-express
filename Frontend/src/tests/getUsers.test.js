import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { createUser, createOrganization } from '../api/getUsers';

const axiosM = new MockAdapter(axios);

describe('user data returned from api', () => {
  axiosM.onGet().reply(200, [{
    username: 'tindo',
    address: 'sdf',
    state: 'sdf',
    city: 'sdf',
    zip: 'sdf',
    email: 'lol',
    password: 'tindo',
    type: 'user',
    id: 5,
  }]);

  // test('test user data  correctly returned', async () => {
  //     await getUsers().then((user_data) => expect(user_data[0].address).toBe("sdf"));
  // });
});

describe('user data posted to api', () => {
  axiosM.onPost().reply(201, null);

  test('test user data  correctly returned', async () => {
    await createUser().then((response) => expect(response).toBeNull());
  });
});

describe('organization data posted to api', () => {
  axiosM.onPost().reply(201, null);

  test('test user data  correctly returned', async () => {
    await createOrganization().then((response) => expect(response).toBeNull());
  });
});

describe('get id from username', () => {
  axiosM.onGet().reply(200, [{
    username: 'tindo',
    address: 'sdf',
    state: 'sdf',
    city: 'sdf',
    zip: 'sdf',
    email: 'lol',
    password: 'tindo',
    type: 'user',
    id: 5,
  }]);

  // test('test get id from username', async () => {
  //     await getIDFromUsername("tindo").then((userID) => expect(userID).toBe(5));
  // });
});
