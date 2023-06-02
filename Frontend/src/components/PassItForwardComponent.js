import React, { useEffect, useState, useRef } from 'react';
import {
  Divider, Box,
} from '@mui/material/';
import { useParams, useNavigate } from 'react-router-dom';
import { getCharityFromName } from '../api/getCharityData';
import { checkUserExists, verifyToken } from '../api/getUsers';
import NavBar from './NavBar';
import { postNotification } from '../api/postNotification';

function PassItForward() {
  const defaultInfo = {
    name: 'N/A',
    orgID: 'N/A',
    imgID: 'N/A',
    description: 'N/A',
    items: [],
    itemsName: [],
  };
  const username = useRef('');
  const message = useRef('');
  const [textResponse, setTextResponse] = useState('');
  const [charityInfo, setCharityInfo] = useState(defaultInfo);
  const { charityName } = useParams();
  const [additionalInfo, setAdditionalInfo] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const navigate = useNavigate();
  /*
  const [showNotif, setShowNotif] = useState(false)
  const [additionalInfo, setAdditionalInfo] = useState(false) */

  const validateTextFilled = () => {
    if (username.current === '' || message.current === '') {
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    if (e.target.name === 'username') {
      username.current = e.target.value;
    }

    if (e.target.name === 'message') {
      message.current = e.target.value;
    }
  };

  const handleClick = async (e) => {
    // if submit is pressed, ensure username is valid and text is filled
    if (e.target.name === 'submit') {
      // tResponse tracks the error message to be displayed for text inputs
      let tResponse = '';
      // check that the username that is provided exists
      const userExists = await checkUserExists(username.current);
      if (!userExists) {
        tResponse = 'Please enter a valid username.';
      }
      // check that the text inputs are not empty
      if (!validateTextFilled()) {
        tResponse = 'Please enter a username and message.';
      }

      setTextResponse(tResponse);
      // if there is no text input errors, post the notification
      if (tResponse === '') {
        await postNotification(username.current, message.current, 'pass_forward');
        navigate('/search_charities');
      }
    }

    // if skip is pressed, navigate to search_charities
    if (e.target.name === 'skip') {
      navigate('/search_charities');
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

        // get the list the items that the organization is requesting
        for (let i = 0; i < response.items.length; i += 1) {
          itemsNameList.push(response.items[i].item);
        }

        setCharityInfo({
          id: `${response.id}`,
          name: `${response.orgname}`,
          orgID: `${response.orgID}`,
          description: `${response.description}`,
          imgID: `${response.imgID}`,
          items: response.items,
          itemsName: itemsNameList,
        });
      } catch (err) {
        setCharityInfo(defaultInfo);
      }
    };
    checkLogin();
    getCharityFromNameWrapper();
  }, [charityName]);
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
          <span className="flex-shrink text-3xl font-bold ">
            {charityInfo.name}
            {' '}
            thanks you for your generosity!
          </span>
        </Box>

        <Divider color="fav-orange'" variant="middle" />

        <Box size="large" sx={{ m: 2 }} className="text-2xl">
          <div className="flex flex-wrap items-center ">
            <div className="mr-3">
              <p className="mr-1">
                {' '}
                <em>
                  Pass it forward!  If you would like
                  to share your donation with anyone, you may enter that person&apos;s username
                  and your message below.
                </em>

              </p>
            </div>
            <p className="block text-red-500">
              {textResponse}
            </p>
          </div>
        </Box>

        <Box display="flex" justifyContent="center" sx={{ paddingTop: 5, paddingBottom: 5, width: 400 }}>
          <div className="flex items-center">
            <label htmlFor="s2-2" className="mr-3">
              Username:
              <input
                id="outlined-basic"
                name="username"
                onChange={handleChange}
              />
            </label>
          </div>
        </Box>

        <Box display="flex" justifyContent="center" sx={{ paddingTop: 5, paddingBottom: 5, width: 515 }}>
          <div>
            <label htmlFor="s2-2" className="mr-3">
              Message:
              <input
                id="outlined-multiline-flexible"
                name="message"
                style={{ width: 300 }}
                // multiline
                rows={5}
                onChange={handleChange}
              />
            </label>
          </div>
        </Box>
        <div>
          <span aria-label="Submit PassItForward">
            <button
              id="send message"
              onClick={handleClick}
              aria-label="Submit PassItForward"
              className="px-5 py-2.5 mt-3 bg-sky-500 hover:bg-sky-600 rounded text-white"
              type="button"
              name="submit"
            >
              Send message
            </button>
          </span>

          <span>
            <button
              id="skip"
              onClick={handleClick}
              name="skip"
              className="px-5 py-2.5 mt-3 bg-gray-100 hover:bg-gray-200 rounded text-black"
              type="button"
            >
              Skip
            </button>
          </span>
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

export default PassItForward;
