import axios from 'axios';
import { API_KEY, coordinatesAPILink } from '../utils/utils';

export const replaceAddr = (addr) => addr.replace(' ', '%20');

export const getCoordinates = async (addr) => {
  try {
    const formattedAddr = replaceAddr(addr);
    const resp = await axios.get(`${coordinatesAPILink}address=${formattedAddr}&key=${API_KEY}`);
    return resp.data.results[0].geometry.location;
  } catch (error) {
    return null;
  }
};
