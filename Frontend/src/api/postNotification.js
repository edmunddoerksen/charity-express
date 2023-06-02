import axios from 'axios';
import { notificationsURL } from '../utils/utils';
import { getIDFromUsername } from './getUsers';
import auth from '../utils/auth';

export const getNumberOfNotifications = async (userId) => {
  try {
    const response = await axios.get(`${notificationsURL}?userId=${userId}`);
    return response.data.length;
  } catch (err) {
    return 0;
  }
};

export const postNotification = async (username, message, notifType) => {
  try {
    const recipientID = await getIDFromUsername(username);
    const notifID = (await getNumberOfNotifications(recipientID)) + 1;
    const currentDate = new Date();
    const response = await axios.post(
      notificationsURL,
      `id=${notifID}&recipientID=${recipientID}&senderID=${auth.getUserId()}&message=${message}&timeStamp=${currentDate}&notificationType=${notifType}`,
    );
    return response.data;
  } catch (err) {
    return null;
  }
};
