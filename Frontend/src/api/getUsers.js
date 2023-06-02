import axios from 'axios';
import {
  backendURL, usersURL, charitiesURL, userURL,
} from '../utils/utils';

export const userLogin = async (userName, pass) => {
  try {
    const data = `username=${userName}&password=${pass}`;
    const response = await axios.post(`${backendURL}/api/login`, data);
    return response.data.apptoken;
  } catch (err) {
    return null;
  }
};

export const setHeaders = () => {
  axios.defaults.headers.common.Authorization = sessionStorage.getItem(
    'app-token',
  );
};

export const getUserProfile = async () => {
  try {
    setHeaders();
    const response = await axios.get(`${backendURL}/api/getUserProfile`);
    // return the token
    // console.log('response', response);
    return response.data.profile;
  } catch (err) {
    // console.log('error', err.message);
    // console.log(err);
    return err.message;
  }
};

export const verifyToken = async () => {
  try {
    setHeaders();
    const response = await axios.get(`${backendURL}/api/login`);
    // return the token
    return response.data.apptoken;
  } catch (err) {
    // console.log('error', err.message);
    return err.message;
  }
};

export const getUsers = async () => {
  try {
    const response = await axios.get(usersURL);
    return response.data.data;
  } catch (err) {
    return [];
  }
};

export const getUser = async (username) => {
  try {
    const response = await axios.get(`${usersURL}`);
    const users = response.data.data;
    for (let i = 0; i < users.length; i += 1) {
      if (users[i].username === username && users[i].type === 'user') {
        return users[i];
      }
    }

    return null;
  } catch (err) {
    return null;
  }
};

export const validateCredential = async (username, password) => {
  try {
    const users = await getUsers();
    let i = 0;

    for (i = 0; i < users.length; i += 1) {
      if (username === users[i].username) {
        // console.log('found');
        break;
      }
    }

    if (i === users.length) {
      return { data: false, error: null };
    }
    if (users[i].username === username && users[i].password === password) {
      if (users[i].type === 'user') {
        return { data: true, error: null, message: 'usuccess' };
      }
      if (users[i].type === 'organization') {
        return { data: true, error: null, message: 'success' };
      }
    }

    return { data: false, error: null };
  } catch (err) {
    return { data: false, error: err.message };
  }
};

export const validateBeforeChangingInformation = async (
  usernameToCheck,
  emailToCheck,
  userType,
) => {
  try {
    const res = await axios.post(`${userURL}/checkUniqueness`, {
      username: usernameToCheck,
      email: emailToCheck,
      userType,
    });
    if (res.status === 200) {
      return { success: true };
    }
    return {
      success: false,
      duplicatedUser: !!res.data.duplicatedUser,
      duplicatedEmail: !!res.data.duplicatedEmail,
    };
  } catch (err) {
    // console.log(err);
    return false;
  }
};

export const createUser = async (userObject) => {
  try {
    const userInfo = {
      username: userObject.username,
      address: userObject.address,
      state: userObject.state,
      city: userObject.city,
      zip: userObject.zip,
      email: userObject.email,
      password: userObject.password,
      dayJoined: userObject.dayJoined,
      monthJoined: userObject.monthJoined,
      yearJoined: userObject.yearJoined,
      type: 'user',
      fav_charities: [],
      donation_history: [],
    };
    const response = await axios.post(usersURL, userInfo);
    return response.data.data;
  } catch (err) {
    return null;
  }
};

export const updateUserInfo = async (newInfo, userType) => {
  try {
    setHeaders();
    const response = await axios.put(`${userURL}/changeUserInfo`, {
      userInfo: newInfo,
      userType,
    });
    if (response.status === 205) {
      return { success: false };
    }
    return { success: true, username: response.data.username };
  } catch (err) {
    // console.log(err);
    return null;
  }
};

export const createOrganization = async (orgObject) => {
  try {
    // let response = await axios.post(usersURL, orgInfo)
    // console.log(orgObject);
    const response = await axios.post(charitiesURL, {
      username: orgObject.username,
      address: orgObject.address,
      state: orgObject.state,
      city: orgObject.city,
      zip: orgObject.zip,
      email: orgObject.email,
      password: orgObject.password,
      dayJoined: orgObject.dayJoined,
      monthJoined: orgObject.monthJoined,
      yearJoined: orgObject.yearJoined,
      type: 'organization',
    });
    // console.log('my response is ', response.data.data);
    return response.data.data;
  } catch (err) {
    // console.log(err);
    return null;
  }
};

export const checkUserExists = async (username) => {
  try {
    const response = await axios.get(usersURL);
    const users = response.data.data;
    for (let i = 0; i < users.length; i += 1) {
      if (users[i].username === username) {
        return true;
      }
    }
    return false;
  } catch (err) {
    return false;
  }
};

export const getIDFromUsername = async (username) => {
  try {
    const response = await axios.get(usersURL);
    const users = response.data.data;
    for (let i = 0; i < users.length; i += 1) {
      if (users[i].username === username) {
        return users[i].id;
      }
    }
    return null;
  } catch (err) {
    return null;
  }
};
