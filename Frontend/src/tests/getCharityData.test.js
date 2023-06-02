import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const axiosM = new MockAdapter(axios);

describe('organization data returned from api', () => {
  axiosM.onGet().reply(200, {
    id: 8,
    orgname: 'American Cancer Society',
    orgID: 'acs',
    city: 'Atlanta',
    state: 'GA',
    imgID: '1htFnaBzlEJ03etLx_xDNomFDN1a-v7UQ',
    rank: 8,
  });

  test('test organization city data  correctly returned', async () => {
    // await getCharities().then((organization_data) =>
    // expect(organization_data.city).toBe("Atlanta"));
  });
});

describe('getCharityFromRank correctly returned api', () => {
  axiosM.onGet().reply(200, {
    id: 8,
    orgname: 'American Cancer Society',
    orgID: 'acs',
    city: 'Atlanta',
    state: 'GA',
    imgID: '1htFnaBzlEJ03etLx_xDNomFDN1a-v7UQ',
    rank: 8,
  });

  // test('test charity data correctly returned', async () => {
  //     await getCharityFromRank(0).then((charity) => expect(charity.orgID).toBe("acs"));
  // });
});

describe('getCharityDataFromName data returned correctly through axios', () => {
  axiosM.onGet().reply(200, {
    id: 8,
    orgname: 'American Cancer Society',
    orgID: 'acs',
    city: 'Atlanta',
    state: 'GA',
    imgID: '1htFnaBzlEJ03etLx_xDNomFDN1a-v7UQ',
    rank: 8,
  });

  // test('test getCharityFromName data correctly returned', async () => {
  //     await getCharityFromName("ac").then((data) => expect(data).toBeNull());
  // });
});
