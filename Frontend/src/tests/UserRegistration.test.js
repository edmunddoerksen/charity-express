/**
 * @jest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-test-renderer';
import UserRegistration from '../components/UserRegistration';

test('render Username line user-reg', () => {
  render(<UserRegistration />);
  const useLine = screen.getByText('Username:');
  expect(useLine).toBeInTheDocument();
});

test('failed user registration', () => {
  render(<UserRegistration />);
  act(() => {
    userEvent.type(screen.getByText('Username:'), 'k');
    userEvent.type(screen.getByText('Email Address:'), 'k');
    userEvent.type(screen.getByText('Password:'), 'f');
    userEvent.type(screen.getByText('Street Address:'), 'f');
    userEvent.type(screen.getByText('State:'), 'f');
    userEvent.type(screen.getByText('City:'), 'f');
    userEvent.click(screen.getByText('Donator'));
    userEvent.click(screen.getByText('Create an account'));
  });
  const failMessage = screen.getByTestId('displayedMessage');
  expect(failMessage).toBeInTheDocument();
});
