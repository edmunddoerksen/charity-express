import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBell } from '@fortawesome/free-solid-svg-icons';
import { NavLink, useNavigate } from 'react-router-dom';
import Notification from './Notification';
import { navbarLogo } from '../utils/utils';
import { getUserProfile } from '../api/getUsers';

const handleLogoutClick = () => {
  // remove the app-token
  sessionStorage.removeItem('app-token');
  sessionStorage.removeItem('profile');
};

function NavBar({
  setAdditionalInfo,
  additionalInfo,
  setShowNotif,
  showNotif,
}) {
  const navigate = useNavigate();

  // {
  //   /*
  //    * Objective: get the user information somehow from the navbar?
  //    * If the user is logged in, then direct, else not?
  //    */
  // }
  const routeChange = async () => {
    try {
      const response = await getUserProfile();
      console.log('hello');
      // console.log(response.username);
      navigate(`/user/edit/${response.username}`);
      // console.log('my response is', response);
    } catch (err) {
      // console.log('my error is', err);
    }
  };
  return (
    <div className=" bg-white pb-5 sticky w-full top-0">
      <nav className="z-0 relative h-14  bg-gray-800 mb-3 border-gray-200 px-2 sm:px-3 py-2.5 text-white">
        <div className="absolute left-4 top-2 flex flex-wrap items-center justify-between mx-auto">
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
        <div className="absolute top-2 right-4 flex max-h-full gap-x-2">
          <button
            data-testid="testButton"
            type="button"
            onClick={() => {
              setShowNotif(!showNotif);
            }}
          >
            <FontAwesomeIcon
              icon={faBell}
              color="white"
              className="bg-black bg-opacity-100 p-2 text-lg rounded-full drop-shadow-lg hover:bg-slate-700"
            />
            {' '}
          </button>
          <div>
            <Notification show={showNotif} setShowNotif={setShowNotif} />
          </div>

          <div className="">
            <button
              type="button"
              onClick={() => setAdditionalInfo(!additionalInfo)}
              data-testid="userIconButton"
            >
              <FontAwesomeIcon
                icon={faUser}
                color="white"
                className="bg-black bg-opacity-100 p-2 text-lg rounded-full drop-shadow-lg hover:bg-slate-700"
              />
            </button>
            <div>
              {additionalInfo && (
                <div className="bg-white rounded shadow-sm h-44 w-44 right-1 z-20 top-12 absolute text-black">
                  <div
                    className="p-3 text-center text-black text-lg"
                    data-testid="tindo"
                  >
                    Tin Do
                  </div>
                  <div className="p-3 text-center border-black border-b-2">
                    <NavLink
                      className="font-medium text-blue-600 underline"
                      onClick={routeChange}
                    >
                      Change Account Information
                    </NavLink>
                  </div>
                  <div className="text-center p-3 ">
                    <NavLink
                      className="font-medium text-blue-600 underline"
                      to="/"
                      data-testid="logoutLink"
                      onClick={handleLogoutClick}
                    >
                      Logout
                    </NavLink>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
NavBar.propTypes = {
  setAdditionalInfo: PropTypes.func,
  additionalInfo: PropTypes.bool,
  setShowNotif: PropTypes.func,
  showNotif: PropTypes.bool,
};

NavBar.defaultProps = {
  setAdditionalInfo: () => null,
  additionalInfo: false,
  setShowNotif: () => null,
  showNotif: false,
};

export default NavBar;
