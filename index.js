const webapp = require('./server');

const port = process.env.PORT || 8080;

webapp.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log('server running on port', port);
});

module.exports = webapp;
