import axios from 'axios';
import { notificationsURL } from '../utils/utils';

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
/* simulating delay from the server
https://stackoverflow.com/questions/61117174/how-to-give-a-delay-to-axios-in-a-loop-array
*/
export const getNotifications = async (startIdx, userId) => {
  try {
    const response = await axios
      .get(`${notificationsURL}?userId=${userId}&type=user`)
      .then(await wait(1000));
    response.data.sort((a, b) => b.timeStamp - a.timeStamp);
    return response.data.slice(startIdx, startIdx + 10);
  } catch (err) {
    return err;
  }
};

export default { getNotifications };
