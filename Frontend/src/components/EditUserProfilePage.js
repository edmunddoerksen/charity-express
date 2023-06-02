import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import {
  // getUsers,
  // getUser,
  updateUserInfo,
  validateBeforeChangingInformation,
  // verifyToken,
  getUserProfile,
} from '../api/getUsers';
import { navbarLogo } from '../utils/utils';

/* Referenced
    https://www.section.io/engineering-education/creating-a-modal-dialog-with-tailwind-css/
  */
function SuccessRegisterModal({ usr }) {
  const navigate = useNavigate();

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
              User Information has been successfully updated!
            </p>
          </div>
          <div className="items-center px-4 py-3">
            <button
              type="button"
              onClick={() => navigate(`/user/${usr}`)}
              id="ok-btn"
              className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              Back to user profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

SuccessRegisterModal.propTypes = {
  usr: PropTypes.string,
};

SuccessRegisterModal.defaultProps = {
  usr: '',
};

function EditUserProfilePage() {
  const [registered, setRegistered] = useState('fail');
  const username = useRef('');
  const address = useRef('');
  const state = useRef('');
  const city = useRef('');
  const zip = useRef('');
  const email = useRef('');
  const password = useRef('');
  const navigate = useNavigate();

  const user = useParams().username;

  const updateUsr = useRef(user);

  useEffect(() => {
    const checkLogin = async () => {
      // attempt to retrieve token
      const token = sessionStorage.getItem('app-token');
      // console.log(token);
      // check if token exists
      if (token) {
        // const isVerified = await verifyToken();
        try {
          // this return the username
          const response = await getUserProfile(token);
          const currentUserName = response.username;
          // if the username request is not the same as the logged in user,
          // redirect to the logged in username
          if (currentUserName !== user) {
            navigate(`/user/edit/${currentUserName}`, { replace: true });
          }
        } catch (err) {
          // console.log(err);
        }
      } else {
        navigate('/', { replace: true });
      }
    };
    checkLogin();
  }, []);

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
    }

    if (e.target.name === 'email') {
      email.current = e.target.value;
    }

    if (e.target.name === 'pwd') {
      password.current = e.target.value;
    }
  };

  const performUpdate = async () => {
    try {
      const res = await validateBeforeChangingInformation(
        username.current ? username.current : '',
        email.current ? email.current : '',
        'user',
      );

      if (res.success) {
        // console.log('i am here3');
        // ?
        try {
          const updatedUser = {};
          if (username.current) {
            updatedUser.username = username.current;
          }
          if (address.current) {
            updatedUser.address = address.current;
          }
          if (city.current) {
            updatedUser.city = city.current;
          }
          if (state.current) {
            updatedUser.state = state.current;
          }
          if (zip.current) {
            updatedUser.zip = zip.current;
          }
          if (email.current) {
            updatedUser.email = email.current;
          }
          if (password.current) {
            updatedUser.password = password.current;
          }

          // console.log(updatedUser);
          // this is not working

          const response = await updateUserInfo(updatedUser, 'user');
          // console.log('my response is', response);
          if (response.success) {
            setRegistered('success');
            updateUsr.current = response.username;
          } else {
            // user is not logged in :(
            // ToDO: planning to create some sort of modal to show the user
            // that they are not logged in and allow them to redirect to the login page
          }
        } catch (err) {
          // console.log(err);
        }
      } else
      // there is a case where both are duplciated too,
      // but i am too lazy to take care of that case
      if (res.duplicatedUser) {
        setRegistered('usedUsername');
      } else if (res.duplicatedEmail) {
        setRegistered('usedEmail');
      }

      return true;
    } catch (err) {
      // console.log(err);
      return err;
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    await performUpdate();
  };

  let message = '';

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
      {registered === 'success' && (
        <SuccessRegisterModal usr={updateUsr.current} />
      )}
      <div className="bg-grey-lighter min-h-screen flex flex-col">
        <div className="border-5 border-sky-500 container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
          <div className="w-full bg-white rounded-lg shadow dark:border p-3">
            <h4 className="mb-8 text-xl font-medium text-center">
              Edit Profile
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
                  data-testid="usr"
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
                  data-testid="email"
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
                  data-testid="pwd"
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
                  data-testid="addr"
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
                  data-testid="state"
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
                  data-testid="city"
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
                  data-testid="zip"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  onChange={handleChange}
                />
              </div>
              <p className="text-sm text-center">
                {message && (
                  <span
                    className="block text-red-500"
                    data-testid="displayedMessage"
                  >
                    {message}
                  </span>
                )}
              </p>
              <button
                type="submit"
                onClick={handleClick}
                className="w-full bg-sky-500 hover:bg-sky-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 text-white"
              >
                Update Profile
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
export default EditUserProfilePage;
