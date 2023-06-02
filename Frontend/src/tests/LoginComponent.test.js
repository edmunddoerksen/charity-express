/**
* @jest-environment jsdom
*/

import '@testing-library/jest-dom/extend-expect';

test('render create user account option ', () => {
  // const { getByText } = render(<LoginComponent />);
  // const linkElement = getByText('Create a user account');
  // expect(linkElement).toBeInTheDocument();
});

// test('render username textbox', () => {
//   render(<LoginComponent />);
//   const textbox = screen.getByText('Username');
//   expect(textbox).toBeInTheDocument();
// });

// test('render password textbox', () => {
//   render(<LoginComponent />);
//   const textbox = screen.getByText('Password');
//   expect(textbox).toBeInTheDocument();
// });

// test('render login button', () => {
//   render(<LoginComponent />);
//   const loginButton = screen.getByRole('button');
//   expect(loginButton).toBeInTheDocument();
// });

// test('render Made with Love', () => {
//   render(<LoginComponent />);
//   const madeWithLove = screen.getByTestId('love');
//   expect(madeWithLove).toBeInTheDocument();
// });

// test('please enter username and password appears if user textbox empty', async () => {
//   render(<LoginComponent />);
//   act(() => {
//     userEvent.click(screen.getByText('Login'));
//   });
//   const linkElement = screen.getByText('Please enter a username and password');
//   expect(linkElement).toBeInTheDocument();
// });

// test('logout button not in intial rendering', () => {
//   const { getByText } = render(<LoginComponent />);
//   const linkElement = screen.queryByText('Logout');
//   expect(linkElement).not.toBeInTheDocument();
// });

// test('charity express in intial rendering', () => {
//   const { getByText } = render(<LoginComponent />);
//   const linkElement = screen.queryByText('Charity Express');
//   expect(linkElement).toBeInTheDocument();
// });
