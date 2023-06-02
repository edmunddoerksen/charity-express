module.exports = (api) => {
  api.cache.forever();
  return {
    plugins: ['macros'],
  };
};
