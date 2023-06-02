// /**
//  * @jest-environment jsdom
//  */
// import React from 'react';
// import '@testing-library/jest-dom/extend-expect';
// // import testing library functions
// import { render, screen } from '@testing-library/react';
// import '@testing-library/jest-dom/extend-expect';
// import userEvent from '@testing-library/user-event';
// import renderer, { act } from 'react-test-renderer';
// import CharitiesDisplay from '../components/CharitiesDisplay'
// import SearchResultsDisplay from '../components/SearchResultsDisplay'
// // import { createMount } from '@mui/core/test-utils';

// // testing that the UI matches the wireframes

test('render Hello World', () => {
//   render(<CharitiesDisplay/>);
//   const text = screen.getByText('Charities');
//   expect(text).toBeInTheDocument();
});

// // test('render search bar', () => {
// //     render(<CharitiesDisplay/>);
// //     const searchBar = screen.queryByPlaceholderText(/Search for Charity/i);
// //     expect(searchBar).toBeInTheDocument();
// // });

// test('render Search button', () => {
//   render(<CharitiesDisplay/>);
//   const text = screen.getByText('Search');
//   expect(text).toBeInTheDocument();
//   const searchButton = screen.getByRole('button')[0];
//   expect(searchButton).toBeInTheDocument();
// });

// // Snapshot test
// // test('snapshot test', () => {
// //     const component = renderer.create(<CharitiesDisplay/>);
// //     const domTreeJSON = component.toJSON();
// //     // matcher
// //     expect(domTreeJSON).toMatchSnapshot();
// // });

//   // Event tests
//   test('typing in charity search bar successful', async () => {
//     render(<CharitiesDisplay />);

//       act(() => {
//         userEvent.type(screen.getByRole('textbox'), 'R');
//         userEvent.click(screen.getByText('Search'));
//       });

//     const searchBar = screen.queryByPlaceholderText(/Search for Charity/i);
//     expect(searchBar).toBeInTheDocument();
//     });
