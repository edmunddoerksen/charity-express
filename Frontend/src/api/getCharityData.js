import axios from 'axios';
import { charityRankURL, charitiesURL, backendURL } from '../utils/utils';

export const charityLogin = async (username, password) => {
  try {
    const response = await axios.post(`${backendURL}/api/login`, {
      username,
      password,
    });
    // return the token
    return response.data.apptoken;
  } catch (err) {
    // console.log('error', err.message);
    return err.message;
  }
};

export const getCharityFromRank = async (rank) => {
  try {
    const response = await axios.get(`${charityRankURL}/${rank}`);
    // console.log(response.data.data);
    return response.data.data;
  } catch (err) {
    return { name: 'N/A', location: 'N/A', imgID: 'N/A' };
  }
};

export const getCharities = async () => {
  try {
    const response = await axios.get(`${charitiesURL}`);
    return response.data.data;
  } catch (err) {
    return [];
  }
};

export const getCharityFromName = async (charityName) => {
  try {
    const response = await axios.get(`${charitiesURL}/${charityName}`);
    const charity = response.data.data;
    return charity;
    /*
    for (let i = 0; i < charities.length; i += 1) {
      if (charities[i].orgID === charityName) {
        return charities[i];
      }
    }
    return null;
    */
  } catch (err) {
    return null;
  }
};

export const updateCharityInfo = async (orgIDRank, newInfo) => {
  try {
    const response = await axios.put(`${charityRankURL}/${orgIDRank}`, newInfo);
    return response.data.data;
  } catch (err) {
    return null;
  }
};
