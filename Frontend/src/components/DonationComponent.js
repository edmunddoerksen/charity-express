import React, { useEffect, useState } from 'react';
import {
  Divider, Box, Slider,
} from '@mui/material/';
import { useParams, useNavigate } from 'react-router-dom';
import { getCharityFromName } from '../api/getCharityData';
import NavBar from './NavBar';
import {
  imageURL,
  // instagramLogoURL,
  // twitterLogoURL,
} from '../utils/utils';
import { createNotifications, putUpdatedQuantities, updateDonationHistory } from '../api/postDonation';
import { verifyToken } from '../api/getUsers';

function DonationComponent() {
  const { charityName } = useParams();
  const defaultInfo = {
    name: charityName || 'N/A',
    orgID: 'N/A',
    imgID: 'N/A',
    description: 'N/A',
    items: [],
    itemsName: [],
  };
  const [charityInfo, setCharityInfo] = useState(defaultInfo);
  const [showNotif, setShowNotif] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState(false);
  const [quantitiesDonated, setQuantitiesDonated] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  /*
  const [showNotif, setShowNotif] = useState(false)
  const [additionalInfo, setAdditionalInfo] = useState(false) */

  // const containerStyle = {
  //   width: '50vw',
  //   height: '400px',
  // };

  const handleClick = async (e) => {
    if (e.target.id === 'submit') {
      const hasNonNeg = quantitiesDonated.some((q) => q > 0);
      // console.log('quantitiesDonated', quantitiesDonated);
      if (hasNonNeg) {
        await putUpdatedQuantities(charityInfo.orgID, quantitiesDonated);
        await createNotifications(charityInfo.orgID, quantitiesDonated);
        await updateDonationHistory(quantitiesDonated, charityInfo.name, charityInfo.itemsName);
        navigate(`/passitforward/${charityName}`);
      } else {
        setMessage('Donated quantities must be positive.');
      }
    }
    if (e.target.id === 'back') {
      navigate(`/charities/${charityName}`);
    }
  };

  // code for variable sliders was partially adapted from https://stackoverflow.com/questions/54541465/react-dynamic-slider
  const handleSliderChange = (i, newVal) => {
    const qDCopy = [...quantitiesDonated];
    qDCopy[i] = newVal;
    setQuantitiesDonated(qDCopy);
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
        // set quantities donated to all 0s
        setQuantitiesDonated(new Array(itemsNameList.length).fill(0));

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
  return (
    <div className="flex flex-col justify-center">
      ;
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
            Donate to
            {' '}
            {charityInfo.name}
          </span>
        </Box>

        <Divider color="fav-orange'" variant="middle" />
        <Box sx={{ m: 2 }} className="text-2xl">
          <div className="flex flex-wrap items-center ">
            <div className="mr-3">
              <p className="mr-1">
                <em>
                  Select the number of each item
                  that you would like to donate
                </em>
              </p>
            </div>
            <p className="block text-red-500">
              {message}
            </p>
          </div>
          {charityInfo.items.map((item, i) => {
            if (item.needed - item.received) {
              return (
                <div key={`${charityInfo.itemsName[i]}${item.needed - item.received}}`}>
                  <Box sx={{ paddingTop: 5, paddingBottom: 5, width: 350 }}>
                    <div className="Items-List">{`${charityInfo.itemsName[i]}`}</div>
                    <Slider
                      step={1}
                      min={0}
                      max={item.needed - item.received}
                      marks={[{
                        value: 0,
                        label: '0',
                      },
                      {
                        value: item.needed - item.received,
                        label: `${item.needed - item.received}`,
                      }]}
                      value={quantitiesDonated[i]}
                      onChange={(e) => handleSliderChange(i, e.target.value)}
                      valueLabelDisplay="on"
                    />
                  </Box>
                </div>
              );
            }

            return <Box key="empty-box" />;
          })}
        </Box>

        <span>
          <button
            onClick={(e) => handleClick(e)}
            aria-label="Submit Donation"
            id="submit"
            className="px-5 py-2.5 mt-3 bg-sky-500 hover:bg-sky-600 rounded text-white"
            type="button"
          >
            Submit Donation
          </button>
        </span>

        <span>
          <button
            onClick={(e) => handleClick(e)}
            id="back"
            className="px-5 py-2.5 mt-3 bg-gray-100 hover:bg-gray-200 rounded text-black"
            type="button"
          >
            Back
          </button>
        </span>
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

export default DonationComponent;
