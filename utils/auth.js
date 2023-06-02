// authentication + sessions

const jwt = require('jsonwebtoken');

require('dotenv').config();

const { getUser } = require('../model/dbOperations');

/**
 * authenticate the user
 * @param {*} username, password
 * @returns
 */

const authenticateUser = (username, password) => {
  try {
    const token = jwt.sign({ username, password }, process.env.KEY, { expiresIn: '1h' });
    // console.log('token', token);
    return token;
  } catch (err) {
    // console.log('error', err.message);
    return null;
  }
};

/**
 * Verify the user
 * @param {*} token
 * @returns
 */
const verifyUser = async (token) => {
  try {
    // first we decode the payload of the token
    const decoded = jwt.verify(token, process.env.KEY);
    // next, we check if the payload has valid user
    // console.log('decoded', decoded);
    const expectedPassword = decoded.password;
    const user = await getUser(decoded.username);
    if (!user) {
      return false;
    }
    if (user.password !== expectedPassword) {
      // console.log('password wrong');
      return false;
    }
    // sourced from https://stackoverflow.com/questions/51292406/check-if-token-expired-using-this-jwt-library
    const { exp } = decoded;
    if (Date.now() >= exp * 1000) {
      return false;
    }
    return decoded.username;
  } catch (err) {
    // console.log('Error', err);
    return false;
  }
};

/**
 * Get username by token.
 *
 * @param {string} token API KEY token
 * @returns
 */
const getUsernameFromToken = async (token) => {
  try {
    // console.log(token);
    // first we decode the payload of the token
    const decoded = jwt.verify(token, process.env.KEY);
    return decoded.username;
  } catch (err) {
    // console.log('[exception getUsernameFromToken]');
    return false;
  }
};

// Test
module.exports = {
  authenticateUser,
  verifyUser,
  getUsernameFromToken,
};
