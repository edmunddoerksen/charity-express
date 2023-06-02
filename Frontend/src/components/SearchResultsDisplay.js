import React, { useEffect, useState } from 'react';
import {
  Select,
  Box,
  Container,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import SearchBar from './SearchBar';
import { getCharities } from '../api/getCharityData';
import { imageURL } from '../utils/utils'; // navbarLogo also originally imported
import NavBar from './NavBar';

// place holder for a real logo

function RowItem({ name, imgID, orgID }) {
  const imgURL = `${imageURL}${imgID}`;
  return (
    <Box
      key={orgID}
      p={2}
      m={2}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap="20px"
      sx={{ width: 1 / 4 }}
      style={{
        background: 'white',
        borderRadius: '16px',
        border: '2px solid #000',
      }}
    >
      <img className="object-cover" src={imgURL} alt={`${name} org logo `} />

      <span className="sm:text-base text-lg text-blue-700 dark:text-blue-500 hover:underline">
        <NavLink to={`/charities/${orgID}`}>{name}</NavLink>
      </span>
    </Box>
  );
}

RowItem.propTypes = {
  name: PropTypes.string,
  imgID: PropTypes.string,
  orgID: PropTypes.string,
};
RowItem.defaultProps = {
  name: '',
  imgID: '',
  orgID: '',
};

function SearchResultsDisplay({ charity, setCharity }) {
  const [matched, setMatched] = useState([]);
  const [tag, setTag] = useState('N/A');
  const [rating, setRating] = useState('N/A');
  const [state, setState] = useState('N/A');
  const [size, setSize] = useState('N/A');
  const [showNotif, setShowNotif] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === 'tagSelectBox') {
      setTag(e.target.value);
    }

    if (e.target.name === 'ratingSelectBox') {
      setRating(e.target.value);
    }

    if (e.target.name === 'stateSelectBox') {
      setState(e.target.value);
    }

    if (e.target.name === 'sizeSelectBox') {
      setSize(e.target.value);
    }
  };

  useEffect(() => {
    // console.log('i am in useEffect inside ssearfch results display');
    const getCharitiesWrapper = async () => {
      const rows = [];
      try {
        const response = await getCharities();
        response.forEach((element) => {
          if (charity === 'allcharities') {
            rows.push(element);
            return;
          }
          if (element.orgname.toLowerCase().startsWith(charity.toLowerCase())) {
            if (tag !== 'N/A' && element.tag !== tag) {
              return;
            }

            if (rating !== 'N/A' && element.rating !== rating) {
              return;
            }

            if (state !== 'N/A' && element.state !== state) {
              return;
            }

            if (size !== 'N/A' && element.size !== size) {
              return;
            }
            rows.push(element);
          }
        });
        setMatched(rows);
        return rows;
      } catch (err) {
        return rows;
      }
    };
    getCharitiesWrapper();
  }, [charity, tag, rating, state, size]);

  const states = [
    'N/A',
    'AL',
    'AK',
    'AZ',
    'AR',
    'CA',
    'CO',
    'CT',
    'DC',
    'DE',
    'FL',
    'GA',
    'HI',
    'ID',
    'IL',
    'IN',
    'IA',
    'KS',
    'KY',
    'LA',
    'ME',
    'MD',
    'MA',
    'MI',
    'MN',
    'MS',
    'MO',
    'MT',
    'NE',
    'NV',
    'NH',
    'NK',
    'NM',
    'NY',
    'NC',
    'ND',
    'OH',
    'OK',
    'OR',
    'PA',
    'RI',
    'SC',
    'SD',
    'TN',
    'TX',
    'UT',
    'VT',
    'VA',
    'WA',
    'WV',
    'WI',
    'WY',
  ];
  const flexFormat = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  };

  return (
    <div className="flex flex-col justify-center">
      <div className=" bg-white pb-5 z-10 sticky w-full top-0 mb-8">
        <NavBar
          setAdditionalInfo={setAdditionalInfo}
          additionalInfo={additionalInfo}
          setShowNotif={setShowNotif}
          showNotif={showNotif}
        />
        <div className="flex flex-col items-center">
          <div className="flex justify-center mb-5 wrap">
            <div>
              <FormControl
                variant="standard"
                sx={{ m: 1, minWidth: 120, zIndex: '7 !important' }}
                size="small"
              >
                <InputLabel id="tags" data-testid="tagstest">Tags</InputLabel>
                <Select
                  labelId="TagSelect"
                  id="tagSelectBox"
                  name="tagSelectBox"
                  value={tag}
                  label="Age"
                  onChange={handleChange}
                  data-testid="tagsdropdown"
                >
                  <MenuItem value="N/A">N/A</MenuItem>
                  <MenuItem value="Food" data-testid="foodentry">Food</MenuItem>
                  <MenuItem value="Clothing">Clothing</MenuItem>
                  <MenuItem value="Relief">Relief</MenuItem>
                  <MenuItem value="Religious">Religious</MenuItem>
                  <MenuItem value="Disease">Disease</MenuItem>
                  <MenuItem value="Nonprofits">Nonprofits</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div>
              <FormControl
                variant="standard"
                sx={{ m: 1, minWidth: 120, zIndex: '7 !important' }}
                size="small"
              >
                <InputLabel id="rating">Rating</InputLabel>
                <Select
                  labelId="RatingSelect"
                  id="ratingSelectBox"
                  name="ratingSelectBox"
                  value={rating}
                  label="Rating"
                  onChange={handleChange}
                >
                  <MenuItem value="N/A">N/A</MenuItem>
                  <MenuItem value="1 Star">1 Star</MenuItem>
                  <MenuItem value="2 Stars">2 Stars</MenuItem>
                  <MenuItem value="3 Stars">3 Stars</MenuItem>
                  <MenuItem value="4 Stars">4 Stars</MenuItem>
                  <MenuItem value="5 Stars">5 Stars</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div>
              <FormControl
                variant="standard"
                sx={{ m: 1, minWidth: 120, zIndex: '7 !important' }}
                size="small"
              >
                <InputLabel id="state">State</InputLabel>
                <Select
                  labelId="StateSelect"
                  id="stateSelectBox"
                  name="stateSelectBox"
                  value={state}
                  label="State"
                  onChange={handleChange}
                >
                  {states.map((stateAbbr) => (
                    <MenuItem key={stateAbbr} value={stateAbbr}>
                      {stateAbbr}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div>
              <FormControl
                variant="standard"
                sx={{ m: 1, minWidth: 120, zIndex: '7 !important' }}
                size="small"
              >
                <InputLabel id="size">Size</InputLabel>
                <Select
                  labelId="SizeSelect"
                  id="sizeSelectBox"
                  name="sizeSelectBox"
                  value={size}
                  label="Size"
                  onChange={handleChange}
                >
                  <MenuItem value="N/A">N/A</MenuItem>
                  <MenuItem value="Small">Small</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Large">Large</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>

          <div>
            <SearchBar setCharity={setCharity} />
            {' '}
          </div>
        </div>
      </div>
      <div
        onClick={() => {
          setShowNotif(false);
          setAdditionalInfo(false);
        }}
        onKeyDown={() => {
          setShowNotif(false);
          setAdditionalInfo(false);
        }}
        role="presentation"
      >
        <Container className="" style={flexFormat}>
          {matched.map((matchedOrg) => (
            <RowItem
              key={matchedOrg.orgname}
              name={matchedOrg.orgname}
              imgID={matchedOrg.imgID}
              orgID={matchedOrg.orgID}
            />
          ))}
        </Container>
      </div>
      <div>
        <footer className="p-4 mt-4 bg-gray-800 shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400" data-testid="companyStatement">
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

SearchResultsDisplay.propTypes = {
  charity: PropTypes.string,
  setCharity: PropTypes.func,
};
SearchResultsDisplay.defaultProps = {
  charity: '',
  setCharity: () => null,
};

export default SearchResultsDisplay;
