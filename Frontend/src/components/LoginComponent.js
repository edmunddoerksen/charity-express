import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { navbarLogo } from '../utils/utils';
import { getUserProfile, userLogin, verifyToken } from '../api/getUsers';
// import CharitiesDisplay from './CharitiesDisplay';
// import NavBar from './NavBar';

function LoginComponent() {
  const [login, setLogin] = useState('initial');
  const username = useRef('');
  const password = useRef('');
  // const [showNotif, setShowNotif] = useState(false);
  // const [additionalInfo, setAdditionalInfo] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const initializeLogin = async () => {
      // attempt to retrieve token
      const token = sessionStorage.getItem('app-token');
      // check if token exists
      if (token) {
        // attempt to verify the token
        const isVerified = await verifyToken();
        if (isVerified) {
          setLogin('success');
          navigate('/activity_feed', { replace: true });
        } else {
          // token must be expired, remove token + accountType
          setLogin('initial');
          sessionStorage.removeItem('app-token');
          sessionStorage.removeItem('profile');
        }
      }
    };
    initializeLogin();
  }, []);

  const handleClick = async () => {
    try {
      if (
        // this makes the program not calls the server when either or both of the fields are empty
        username.current === ''
        || password.current === ''
      ) {
        setLogin('empty');
        return;
      }
      // authenticate the token
      const token = await userLogin(username.current, password.current);
      if (token) {
        // store the token in sessionStorage
        sessionStorage.setItem('app-token', token);
        // get user profile
        const profile = await getUserProfile();
        // store all user information into the browser session storage (not good for security!)
        sessionStorage.setItem('profile', JSON.stringify(profile));

        setLogin('success');
        navigate('/activity_feed');
      } else {
        setLogin('failure');
      }
    } catch (err) {
      // console.log('error in the login process');
    }
    // not prevent default here because a reload is expected
  };

  const handleChange = (e) => {
    if (e.target.name === 'usr') {
      username.current = e.target.value;
    }

    if (e.target.name === 'pwd') {
      password.current = e.target.value;
    }
  };

  // const handleLogoutClick = () => {
  //   username.current = '';
  //   password.current = '';
  //   setLogin('fail');
  // };

  // if (login === 'csuccess') {
  //   globalThis.window.history.pushState('string', '', '/activity_feed');
  //   return (
  //     <div className="App">
  //       <label htmlFor="s1-2">
  //         Welcome Charity
  //         {username.current}
  //       </label>
  //       <button type="button" onClick={handleLogoutClick}>
  //         Logout
  //       </button>
  //     </div>
  //   );
  // }

  // if (login === 'usuccess') {
  //   globalThis.window.history.pushState('string', '', '/activity_feed');
  //   return (
  //     <div className="App">
  //       <NavBar
  //         setAdditionalInfo={setAdditionalInfo}
  //         additionalInfo={additionalInfo}
  //         setShowNotif={setShowNotif}
  //         showNotif={showNotif}
  //       />
  //       {/* <label htmlFor="s1-2">
  //         Welcome User
  //         {username.current}
  //       </label> */}
  //       {/* <button type="button" onClick={handleLogoutClick}>
  //         Logout
  //       </button> */}
  //       <CharitiesDisplay />
  //     </div>
  //   );
  // }

  let message = '';
  /*
  if (login === 'invalid') {
    message = 'Invalid username and/or password'
  }
  */

  if (login === 'empty') {
    message = 'Please enter a username and password';
  } else if (login === 'failure') {
    message = 'The username or password is incorrect';
  }

  return (
    <div className="App">
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

      <div className="App h-screen flex flex-col justify-center items-center">
        <div className="mb-10 font-extrabold text-3xl">
          <p>Welcome back</p>
        </div>
        <form className="w-2/5">
          <div className="mb-4 flex items-center">
            <label
              className="font-bold text-lg text-gray-700"
              htmlFor="username"
              type="text"
            >
              Username
              <input
                autoComplete="on"
                className="p-2.5 ml-6 grow bg-gray-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400
      focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                id="username"
                onChange={handleChange}
                type="text"
                name="usr"
                data-testid="usernameInput"
              />
            </label>
          </div>

          <div className="mb-6 flex items-center">
            <label
              className="font-bold text-lg text-gray-700"
              htmlFor="pwd"
              type="text"
            >
              Password
              <input
                autoComplete="on"
                className="p-2.5 ml-6 grow bg-gray-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400
      focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                id="pwd"
                onChange={handleChange}
                type="password"
                name="pwd"
              />
            </label>
          </div>

          <button
            onClick={handleClick}
            className="px-5 py-2.5 mt-3 bg-sky-500 hover:bg-sky-600 rounded text-white"
            type="button"
          >
            Login
          </button>
        </form>

        <p className="block text-red-500">{message}</p>
        <div className="mt-5 font-medium text-blue-600 text-lg hover:underline">
          <a href="/register"> Create a user account </a>
        </div>

        <p className="absolute bottom-5" data-testid="love">
          Made with
          <FontAwesomeIcon icon={faHeart} color="red" />
          in Philly
        </p>
      </div>
    </div>
  );
}

export default LoginComponent;
