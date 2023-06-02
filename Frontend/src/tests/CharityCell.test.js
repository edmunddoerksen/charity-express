/**
* @jest-environment jsdom
*/

import '@testing-library/jest-dom/extend-expect';
// import testing library functions

// const axiosM = new MockAdapter(axios);

// describe('organization data returned from api', () => {
//   axiosM.onGet().reply(200, {
//     id: 1,
//     orgname: 'Red Cross',
//     orgID: 'redcross',
//     email: 'admin@redcross.org',
//     address: '430 17th Street NW',
//     city: 'Washington',
//     state: 'DC',
//     coordinates: {
//       lat: 38.9,
//       lng: -77.04,
//     },
//   });

test('test organization city data  correctly returned', async () => {
  // await act(async () => {
  //   render(<CharityBox
  //     name="Red Cross"
  //     location="Washington"
  //     imgID="1JWjNA-uBUiPnpgXl86YzZY7HDdRitFDx"
  //     orgID="redcross"
  //   />);
  // });

  // const charityBox = screen.getByTestId('charityBox');
  // expect(charityBox).toBeInTheDocument();
});
