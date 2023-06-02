import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import PropTypes from 'prop-types';
import { useParams, useNavigate } from 'react-router-dom';

import SearchBar from './SearchBar';
import CharityCell from './CharityCell';

import SearchResultsDisplay from './SearchResultsDisplay';
import NavBar from './NavBar';
import { getCharities } from '../api/getCharityData';
import { verifyToken } from '../api/getUsers';

function GridItem({ rank }) {
  return (
    <Grid data-test-id="grid" item xs={12} sm={4} md={4}>
      <Paper>
        <CharityCell charityRank={rank} />
      </Paper>
    </Grid>
  );
}

GridItem.propTypes = {
  rank: PropTypes.number,
};
GridItem.defaultProps = {
  rank: 0,
};

function CharitiesDisplay({ flag }) {
  const [charity, setCharity] = useState('');
  const [numCharities, setnumCharities] = useState(0);
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
    const getNumberCharitiesWrapper = async () => {
      try {
        const response = await getCharities();
        setnumCharities(response.length);
        return response.length;
      } catch (err) {
        return 0;
      }
    };
    checkLogin();
    getNumberCharitiesWrapper();
  }, [numCharities]);

  if (charity === '' && flag) {
    setCharity(flag);
  }

  if (charity === '' && useParams().charity) {
    setCharity(useParams().charity);
  }

  if (charity !== '') {
    return (
      <div>
        <SearchResultsDisplay charity={charity} setCharity={setCharity} />
      </div>
    );
  }

  const cells = [];

  for (let i = 1; i <= numCharities; i += 1) {
    cells.push(<GridItem key={i} rank={i} />);
  }

  /* Activity feed */

  return (
    <div>
      {/* <p>Hello world</p> */}
      <NavBar
        setAdditionalInfo={setAdditionalInfo}
        additionalInfo={additionalInfo}
        setShowNotif={setShowNotif}
        showNotif={showNotif}
      />
      <SearchBar setCharity={setCharity} />
      <Grid container spacing={1}>
        {cells}
      </Grid>
    </div>
  );
}

CharitiesDisplay.propTypes = {
  flag: PropTypes.string,
};
CharitiesDisplay.defaultProps = {
  flag: '',
};

export default CharitiesDisplay;
