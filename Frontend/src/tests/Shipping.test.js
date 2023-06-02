/**
* @jest-environment jsdom
*/

import '@testing-library/jest-dom/extend-expect';

jest.mock('node-fetch', () => () => Promise.resolve(({
  json: () => ({
    access_token: '12345',
  }),
})));

// render tests

test('Shipping renders', async () => {
  // render(<Shipping />);
  // await sleep(2000);
});
