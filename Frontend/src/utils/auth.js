const getUserId = () => JSON.parse(sessionStorage.getItem('profile')).id;

export default {
  getUserId,
};
