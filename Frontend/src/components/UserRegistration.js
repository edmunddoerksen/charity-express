import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { createUser, getUsers, createOrganization } from '../api/getUsers';
import { navbarLogo } from '../utils/utils';

/*
    https://www.section.io/engineering-education/creating-a-modal-dialog-with-tailwind-css/
*/
function SuccessRegisterModal() {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <FontAwesomeIcon
              icon={faCircleCheck}
              color="white"
              className="text-4xl"
            />
          </div>
          <h3
            className="text-lg leading-6 font-medium text-gray-900"
            data-testid="successStatement"
          >
            Successful!
          </h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              Account has been successfully registered!
            </p>
          </div>
          <div className="items-center px-4 py-3">
            <button
              type="button"
              onClick={() => globalThis.window.location.assign('/')}
              id="ok-btn"
              className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserRegistration() {
  const [registered, setRegistered] = useState('fail');
  const username = useRef('');
  const address = useRef('');
  const state = useRef('');
  const city = useRef('');
  const zip = useRef('');
  const email = useRef('');
  const password = useRef('');
  const userType = useRef('');
  const date = new Date();

  const handleChange = (e) => {
    if (e.target.name === 'usr') {
      username.current = e.target.value;
    }

    if (e.target.name === 'addr') {
      address.current = e.target.value;
    }

    if (e.target.name === 'state') {
      state.current = e.target.value;
    }

    if (e.target.name === 'city') {
      city.current = e.target.value;
    }

    if (e.target.name === 'zip') {
      zip.current = e.target.value;
      // console.log(zip.current);
    }

    if (e.target.name === 'email') {
      email.current = e.target.value;
    }

    if (e.target.name === 'pwd') {
      password.current = e.target.value;
    }

    if (e.target.name === 'userType') {
      userType.current = e.target.value;
    }
  };

  const validateCredential = async (accountType) => {
    try {
      const users = await getUsers();
      let i = 0;

      for (i = 0; i < users.length; i += 1) {
        if (
          users[i].type === accountType
          && username.current === users[i].username
        ) {
          return 'username';
        }

        if (users[i].type === accountType && email.current === users[i].email) {
          return 'email';
        }
      }
      return 'success';
    } catch (err) {
      return 'error';
    }
  };

  const performSignUp = async () => {
    try {
      let msg;
      if (userType.current === 'user') {
        msg = await validateCredential('user');
      } else {
        msg = await validateCredential('charity');
      }
      if (msg === 'email') {
        setRegistered('usedEmail');
      } else if (msg === 'username') {
        setRegistered('usedUsername');
      } else {
        const newUser = {
          username: username.current,
          address: address.current,
          state: state.current,
          city: city.current,
          zip: zip.current,
          email: email.current,
          password: password.current,
          monthJoined: date.getMonth() + 1,
          dayJoined: date.getDate(),
          yearJoined: date.getFullYear(),
        };
        let status = false;
        if (userType.current === 'user') {
          const myResponse = await createUser(newUser);
          if (myResponse) {
            status = true;
          }
        } else {
          const myResponse = await createOrganization(newUser);
          // console.log('here');
          if (myResponse) {
            // console.log('I am here?');
            status = true;
          }
        }
        if (status) {
          setRegistered('success');
        }
      }
      return true;
    } catch (err) {
      // console.log(err);
      return err;
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (
      username.current === ''
      || address.current === ''
      || state.current === ''
      || city.current === ''
      || zip.current === ''
      || email.current === ''
      || password.current === ''
      || userType.current === ''
    ) {
      setRegistered('empty');
      return;
    }
    await performSignUp();
  };

  let message = '';

  if (registered === 'empty') {
    message = 'Please fill out all fields';
  }

  if (registered === 'usedEmail') {
    message = 'The email is already associated with another account';
  }

  if (registered === 'usedUsername') {
    message = 'Username is already taken';
  }

  return (
    <>
      <nav className="absolute bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded">
        <div className="container flex flex-wrap items-center justify-between mx-auto">
          <a className="flex items-center" href="/">
            <img
              src={navbarLogo}
              className="h-6 mr-3 sm:h-9"
              alt="Charity Express Logo"
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap">
              Charity Express
            </span>
          </a>
        </div>
      </nav>
      {registered === 'success' && <SuccessRegisterModal />}
      <div className="bg-grey-lighter min-h-screen flex flex-col">
        <div className="border-5 border-sky-500 container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
          <div className="w-full bg-white rounded-lg shadow dark:border p-3">
            <h4 className="mb-8 text-xl font-medium text-center">
              Create account
            </h4>
            <form name="myForm" className="space-y-4 md:space-y-6" action="#">
              <div className="flex items-center">
                <label className="mr-3" htmlFor="usr">
                  {' '}
                  Username:
                  {' '}
                </label>
                <input
                  autoComplete="on"
                  type="text"
                  name="usr"
                  id="usr"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center">
                <label className="mr-3" htmlFor="email">
                  {' '}
                  Email Address:
                  {' '}
                </label>
                <input
                  autoComplete="on"
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 focus:ring-primary-600 sm:text-sm rounded-lg focus:border-primary-600 block w-full p-2.5"
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center">
                <label className="mr-3" htmlFor="pwd">
                  {' '}
                  Password:
                  {' '}
                </label>
                <input
                  autoComplete="on"
                  type="password"
                  name="pwd"
                  id="pwd"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center">
                <label className="mr-3" htmlFor="addr">
                  {' '}
                  Street Address:
                  {' '}
                </label>
                <input
                  autoComplete="on"
                  type="text"
                  name="addr"
                  id="addr"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center">
                <label className="mr-3" htmlFor="state">
                  {' '}
                  State:
                  {' '}
                </label>
                <input
                  autoComplete="on"
                  type="text"
                  name="state"
                  id="state"
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                />
              </div>
              <div className="flex items-center">
                <label className="mr-3" htmlFor="city">
                  {' '}
                  City:
                  {' '}
                </label>
                <input
                  autoComplete="on"
                  type="text"
                  name="city"
                  id="city"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center">
                <label className="mr-3" htmlFor="zip">
                  {' '}
                  Zip Code:
                  {' '}
                </label>
                <input
                  autoComplete="on"
                  type="text"
                  name="zip"
                  id="zip"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-around items-center flex-wrap">
                <p>Are you a(n): </p>
                {/* Input to pick org */}
                <div className="mr-2">
                  {' '}
                  <label
                    htmlFor="userType"
                    className="ml-1 text-md text-gray-900 "
                  >
                    <input
                      className="w-4 h-4 text-blue-600  focus:ring-blue-500"
                      type="radio"
                      value="org"
                      name="userType"
                      onChange={handleChange}
                    />
                    Organization
                  </label>
                </div>
                <div>
                  {/* Input to pick user */}
                  {' '}
                  <label
                    htmlFor="userType"
                    className="ml-1 text-md text-gray-900 "
                  >
                    <input
                      className="w-4 h-4 text-blue-600  focus:ring-blue-500 "
                      type="radio"
                      value="user"
                      name="userType"
                      onChange={handleChange}
                    />
                    Donator
                  </label>
                </div>
              </div>
              <button
                type="submit"
                onClick={handleClick}
                className="w-full bg-sky-500 hover:bg-sky-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 text-white"
              >
                Create an account
              </button>
              <p className="text-sm text-center">
                {message && (
                  <span
                    className="block text-red-500"
                    data-testid="displayedMessage"
                  >
                    {message}
                  </span>
                )}
                Already have an account?
                {' '}
                <a
                  href="/"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Login here
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
export default UserRegistration;
