import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { getCharityFromRank } from '../api/getCharityData';
import { imageURL } from '../utils/utils';

function CharityBox({
  name, location, imgID, orgID,
}) {
  const imgURL = imgID !== 'undefined'
    ? `${imageURL}${imgID}`
    : 'https://my550imagebucket.s3.amazonaws.com/image_playerholder.avif';

  const image = <img src={imgURL} alt={name} width={200} height={150} />;

  return (
    <div>
      {/* {console.log(orgID)} */}
      <a data-testid="charityBox" href={`/charities/${orgID}`}>
        {' '}
        {name}
        {' '}
      </a>
      <p>
        <em>
          {' '}
          {location}
          {' '}
        </em>
      </p>
      {image}
    </div>
  );
}

CharityBox.propTypes = {
  name: PropTypes.string,
  location: PropTypes.string,
  imgID: PropTypes.string,
  orgID: PropTypes.string,
};

CharityBox.defaultProps = {
  name: 'N/A',
  location: 'N/A',
  imgID: 'N/A',
  orgID: 'N/A',
};

function CharityCell({ charityRank }) {
  const [charity, setCharity] = useState({});
  const charityName = useRef('');

  useEffect(() => {
    const getCharityFromRankWrapper = async () => {
      try {
        const response = await getCharityFromRank(charityRank);
        charityName.current = response.orgname;
        setCharity({
          name: `${response.orgname}`,
          location: `${response.city}, ${response.state}`,
          imgID: `${response.imgID}`,
          orgID: `${response.orgID}`,
        });
      } catch (err) {
        /*
        setCharity({
          name: 'N/A', location: 'N/A', imgID: 'N/A', orgID: 'N/A',
        }); */
        // console.log('the error is', err);
      }
    };

    getCharityFromRankWrapper();
  }, [charityName.current]);
  return (
    <div>
      <CharityBox
        name={charity.name}
        location={charity.location}
        imgID={charity.imgID}
        orgID={charity.orgID}
      />
    </div>
  );
}

CharityCell.propTypes = {
  charityRank: PropTypes.number,
};
CharityCell.defaultProps = {
  charityRank: 0,
};

export default CharityCell;
