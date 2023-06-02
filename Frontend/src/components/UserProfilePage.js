import { Box, Divider } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { getCharities } from '../api/getCharityData';
import { getUser, verifyToken } from '../api/getUsers';
import NavBar from './NavBar';

function UserProfilePage() {
  const [user, setUser] = useState('');
  const favCharities = useRef([]);
  const donations = useRef([]);
  const [userInfo, setUserInfo] = useState({
    username: 'N/A',
    location: 'N/A',
    dateJoined: 'N/A',
    favoritedCharities: [],
    donationHistory: [],
  });
  const charities = useRef([]);

  const [showNotif, setShowNotif] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = async () => {
      // attempt to retrieve token
      const token = sessionStorage.getItem('app-token');
      // check if token exists
      if (token) {
        const isVerified = await verifyToken();
        if (!isVerified) {
          navigate('/', { replace: true });
        }
      } else {
        navigate('/', { replace: true });
      }
    };
    const getCharitiesWrapper = async () => {
      try {
        const response = await getUser(user);
        setUserInfo({
          username: `${response.username}`,
          location: `${response.city}, ${response.state} ${response.zip}`,
          dateJoined: `${response.monthJoined}/${response.dayJoined}/${response.yearJoined}`,
          favoritedCharities: response.fav_charities,
          donationHistory: response.donation_history,
        });

        charities.current = await getCharities();

        return response;
      } catch (err) {
        return null;
      }
    };
    checkLogin();
    getCharitiesWrapper();
  }, [user]);

  if (user !== useParams().username) {
    setUser(useParams().username);
  }

  const donationsList = [];

  for (let i = 0; i < userInfo.donationHistory.length; i += 1) {
    const donation = userInfo.donationHistory[i];

    donationsList.push(
      <li key={i}>
        {donation.charity}
        ,
        {donation.item}
        ,
        {donation.date}
      </li>,
    );
  }

  donations.current = donationsList;

  const charitiesList = [];

  for (let i = 0; i < userInfo.favoritedCharities.length; i += 1) {
    const charity = userInfo.favoritedCharities[i];

    charitiesList.push(
      <li key={i}>
        {' '}
        <NavLink
          to={`/charities/${charity.orgID}`}
          className={({ isActive }) => (isActive ? 'lactive-class' : 'not-active-class')}
          style={{
            color: 'blue',
          }}
        >
          {charity.name}
        </NavLink>
      </li>,
    );
  }

  favCharities.current = charitiesList;

  return (
    <div className="flex flex-col justify-center">
      <NavBar
        setAdditionalInfo={setAdditionalInfo}
        additionalInfo={additionalInfo}
        setShowNotif={setShowNotif}
        showNotif={showNotif}
        data-testid="cdNavBar"
      />
      <div>
        <Box sx={{ my: 3 }} className="flex items-center flex-wrap gap-x-10">
          <span className="flex-shrink text-4xl font-bold ">
            Profile Page
          </span>
        </Box>

        <Divider color="fav-orange'" variant="middle" />

        <Box sx={{ m: 2 }} className="text-2xl">
          <NavLink
            to={`/user/edit/${user}`}
            className={({ isActive }) => (isActive ? 'lactive-class' : 'not-active-class')}
            style={{
              color: 'blue',
            }}
          >
            Edit Profile
          </NavLink>

          <div className="mr-3">
            <strong> Username: </strong>
            {' '}
            { userInfo.username }
          </div>
          <div className="mr-3">
            <strong> Location: </strong>
            {' '}
            { userInfo.location }
          </div>
          <div className="mr-3">
            <strong> Date Joined: </strong>
            { userInfo.dateJoined }
          </div>
          <div>
            <strong> Favorite Charities </strong>
            <ul>
              {favCharities.current}
            </ul>
          </div>
          <div>
            <strong> Donation History </strong>
            <ul>
              {donations.current}
            </ul>
          </div>
        </Box>
      </div>
    </div>
  );
}

export default UserProfilePage;
