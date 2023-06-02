import React, { useEffect, useState } from 'react';
import {
  Divider, LinearProgress, Typography, Box,
} from '@mui/material/';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import PropTypes from 'prop-types';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { getCharityFromName } from '../api/getCharityData';
import NavBar from './NavBar';
import { verifyToken } from '../api/getUsers';
/*

import {
  solid,
  regular,
  brands,
  icon,
} from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used
*/
import {
  API_KEY,
  imageURL,
  // instagramLogoURL,
  // twitterLogoURL,
} from '../utils/utils';
// using google maps api derived from https://www.npmjs.com/package/@react-google-maps/api
// progress bar LinearProgressWithLabel copied from https://mui.com/material-ui/react-progress/

function LinearProgressWithLabel({ value }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" value={value} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  value: PropTypes.number,
};
LinearProgressWithLabel.defaultProps = {
  value: 0,
};

function CharityDescription() {
  const { charityName } = useParams();
  const defaultInfo = {
    name: charityName,
    location: 'N/A',
    imgID: 'N/A',
    description: 'N/A',
    purpose: 'N/A',
    items: [],
    itemsName: [],
    website: '/',
    twitter: 'www.twitter.com',
    instagram: 'www.instagram.com',
    coordinates: {
      lat: 0,
      lng: 0,
    },
  };
  const [charityInfo, setCharityInfo] = useState(defaultInfo);
  const [progressBar, setProgressBar] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState(false);
  const navigate = useNavigate();
  /*
  const [showNotif, setShowNotif] = useState(false)
  const [additionalInfo, setAdditionalInfo] = useState(false) */

  const containerStyle = {
    width: '50vw',
    height: '400px',
  };

  useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: API_KEY,
  });

  const handleClick = (e) => {
    if (e.target.name === 'progressBar') {
      setProgressBar(!progressBar);
    }

    if (e.target.name === 'map') {
      setShowMap(!showMap);
    }
  };
  /*
    A charity id is changed in the URL, which is supplied by the user clicking on one of the
    links on the search charity page.
  */
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
    const getCharityFromNameWrapper = async () => {
      try {
        const response = await getCharityFromName(charityName);
        const itemsNameList = [];
        let twitter;
        let instagram;

        // get the list the items that the organization is requesting
        for (let i = 0; i < response.items.length; i += 1) {
          itemsNameList.push(response.items[i].item);
        }

        // get the list of social media links
        for (let i = 0; i < response.social_medias.length; i += 1) {
          if (response.social_medias[i].social_media === 'twitter') {
            twitter = response.social_medias[i].link;
          }

          if (response.social_medias[i].social_media === 'instagram') {
            instagram = response.social_medias[i].link;
          }
        }

        setCharityInfo({
          name: `${response.orgname}`,
          location: `${response.address} ${response.city}, ${response.state}`,
          imgID: `${response.imgID}`,
          description: `${response.description}`,
          purpose: `${response.purpose}`,
          items: response.items,
          itemsName: itemsNameList,
          website: `${response.website}`,
          twitter: `${twitter}`,
          instagram: `${instagram}`,
          coordinates: response.coordinates,
        });
      } catch (err) {
        setCharityInfo(defaultInfo);
      }
    };
    checkLogin();
    getCharityFromNameWrapper();
  }, [charityName]);

  // This is used to close notificaiton bar whenever the body fo the document is touched

  if (charityInfo.name === 'N/A') {
    return <div />;
  }

  const imgURL = `${imageURL}${charityInfo.imgID}`;
  let image;

  if (charityInfo.imgID) {
    image = (
      <a href={charityInfo.website}>
        <img
          className="w-20 h-20 rounded-lg border border-gray-100 shadow-sm"
          src={imgURL}
          alt={charityInfo.name}
          width={50}
          height={30}
        />
      </a>
    );
  } else {
    image = (
      <img
        className="w-20 h-20 rounded-lg border border-gray-100 shadow-sm"
        alt={charityInfo.name}
      />
    );
  }

  let progressDisplay;
  let progressBarText;
  let mapButtonText;
  let mapDisplay;

  /*
    Display the progress bar
  */
  if (progressBar) {
    progressBarText = 'Hide Progress';
    progressDisplay = charityInfo.items.map((item) => (
      <div key={item.item} className="p-2 flex flex-col items-center">
        <div className="text-xl">{item.item}</div>
        {' '}
        <div className="mt-2 w-1/2 h-6 mb-2 bg-gray-200 rounded-full ">
          <div
            className="bg-progress-bar h-6 text-xs font-medium  text-center text-black p-0.5 leading-none rounded-full"
            style={{ width: `${(item.received / item.needed) * 100}%` }}
          >
            {(item.received / item.needed) * 100}
            %
          </div>
        </div>
      </div>
    ));
  } else {
    progressBarText = 'Show Progress';
    progressDisplay = <div />;
  }

  /*
    Display Google Map
  */
  if (showMap) {
    mapDisplay = (
      <div className="flex flex-col items-center mb-5">
        <GoogleMap
          data-test-id="google-map"
          mapContainerStyle={containerStyle}
          center={charityInfo.coordinates}
          zoom={15}
        >
          <Marker position={charityInfo.coordinates} />
        </GoogleMap>
      </div>
    );
    mapButtonText = 'Hide Map';
  } else {
    mapDisplay = <div />;
    mapButtonText = 'Show Map';
  }

  return (
    <div className="flex flex-col justify-center">
      <NavBar
        setAdditionalInfo={setAdditionalInfo}
        additionalInfo={additionalInfo}
        setShowNotif={setShowNotif}
        showNotif={showNotif}
        data-testid="cdNavBar"
      />
      <div
        /*
        onClick={() => {
          setShowNotif(false)
          setAdditionalInfo(false)
        }}
        */
        className="w-3/4 m-auto"
      >
        <Box sx={{ my: 3 }} className="flex items-center flex-wrap gap-x-10">
          {image}
          <span className="flex-shrink text-4xl font-bold ">
            {charityInfo.name}
          </span>
        </Box>

        <Divider color="fav-orange'" variant="middle" />

        <Box sx={{ m: 2 }} className="text-2xl">
          <div className="mb-5">
            <p>
              <strong>Description:</strong>
              {charityInfo.description}
            </p>
            {' '}
          </div>
          <div className="mb-5">
            <p>
              <strong>Purpose:</strong>
              {charityInfo.purpose}
            </p>
            {' '}
          </div>
          <div className="mb-5 flex gap-x-2">
            <strong>Social media: </strong>
            <a href={charityInfo.twitter}>
              <FontAwesomeIcon
                icon={faTwitter}
                color="white"
                className="bg-twitter-blue text-2xl p-1 rounded-md hover:bg-sky-600"
              />
            </a>
            <a href={charityInfo.instagram}>
              <FontAwesomeIcon
                icon={faInstagram}
                aria-hidden="true"
                id="myInstaLogo"
                className="rounded-md text-4xl "
              />
            </a>
          </div>
          <div>
            <div className="mb-5 flex flex-wrap items-center">
              <div className="mr-3">
                <p>
                  <strong>Location:</strong>
                  {charityInfo.location}
                  {' '}
                </p>
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded text-white"
                type="button"
                name="map"
                onClick={handleClick}
              >
                {mapButtonText}
              </button>
            </div>
            {mapDisplay}
          </div>
          <div className="flex flex-wrap items-center ">
            <div className="mr-3">
              <strong className="mr-1">Items Requested:</strong>
              {charityInfo.itemsName.map((item, i) => {
                if (i !== charityInfo.itemsName.length - 1) {
                  return <span key={item}>{`${item}; `}</span>;
                }
                return <span key={item}>{item}</span>;
              })}
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded text-white"
              type="button"
              name="progressBar"
              onClick={handleClick}
            >
              {progressBarText}
            </button>
          </div>
          <NavLink
            to={`/donate/${charityName}`}
            className={({ isActive }) => (isActive ? 'lactive-class' : 'not-active-class')}
            style={{
              color: 'blue',
            }}
          >
            Donate!
          </NavLink>
        </Box>
        <div className="border border-fav-orange rounded-md ml-2">
          {progressDisplay}
        </div>
      </div>

      <div>
        <footer className="p-4 mt-4 bg-gray-800 shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2023
            {' '}
            <a href="https://charityexpress.com/" className="hover:underline">
              Charity Express™
            </a>
            . All Rights Reserved.
          </span>
        </footer>
      </div>
    </div>
  );
}

export default CharityDescription;
