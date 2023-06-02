import axios from 'axios';
import { backendURL, charitiesURL, usersURL } from '../utils/utils';
import auth from '../utils/auth';

export const putUpdatedQuantities = async (id, quantitesDonated) => {
  try {
    const charityResponse = await axios.get(`${charitiesURL}/${id}`);
    const charity = charityResponse.data.data;

    for (let j = 0; j < charity.items.length; j += 1) {
      charity.items[j].received += quantitesDonated[j];
    }
    charity.notifications = charity.notifications
      ? [...charity.notifications, { items: quantitesDonated, read: false }]
      : [{ items: quantitesDonated, read: false }];

    const response = await axios.put(`${charitiesURL}/${id}`, charity);

    return response;
  } catch (err) {
    // console.log('[putUpdatedQuantities exception]', err);
    return null;
  }
};

export const putDonationUsers = async (id, quantitesDonated) => {
  try {
    const charityResponse = await axios.get(`${charitiesURL}/${id}`);
    const charity = charityResponse.data;
    // update item received counts
    for (let j = 0; j < charity.items.length; j += 1) {
      charity.items[j].received += quantitesDonated[j];
    }
    const response = await axios.put(`${charitiesURL}/${id}`, charity);

    return response;
  } catch (err) {
    return null;
  }
};

export const updateDonationHistory = async (
  quantitesDonated,
  charityName,
  itemNames,
) => {
  try {
    // first, get the user from the database
    const usersResponse = await axios.get(usersURL);
    const users = usersResponse.data.data;
    let currentUser = null;
    for (let i = 0; i < users.length; i += 1) {
      if (users[i].id === auth.getUserId()) {
        currentUser = users[i];
        break;
      }
    }
    const newDonations = [];
    for (let i = 0; i < quantitesDonated.length; i += 1) {
      if (quantitesDonated[i] > 0) {
        const newDonation = {
          charity: `${charityName}`,
          item: `${itemNames[i]}`,
          date: `${new Date()}`,
        };
        newDonations.push(newDonation);
      }
    }
    // update the donation history with new donations
    currentUser.donation_history = currentUser.donation_history.concat(newDonations);
    currentUser.notifications = currentUser.notifications
      ? [...currentUser.notifications, { items: quantitesDonated, read: false }]
      : [{ items: quantitesDonated, read: false }];

    // update the user in the database
    const response = await axios.put(`${usersURL}/${currentUser.username}`, currentUser);
    return response.data;
  } catch (err) {
    // console.log(err);
    return null;
  }
};

export const getUserNotifications = async (userId) => {
  try {
    const response = await axios.get(`${backendURL}/api/notifications?userId=${userId}&type=user`);
    return response.data;
  } catch (err) {
    return null;
  }
};

export const createNotifications = async (charityOrgId, items) => {
  try {
    const response = await axios.post(`${backendURL}/api/notifications`, {
      senderID: auth.getUserId(),
      charity: charityOrgId,
      items,
      message: 'You have received a donation!',
      timeStamp: new Date(),
      recipientID: charityOrgId,
      notificationType: 'message',
    });
    return response.data;
  } catch (err) {
    return null;
  }
};
