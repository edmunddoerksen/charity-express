// import express + cors + dbOperations
const express = require('express');
const cors = require('cors');


const {
  authenticateUser,
  verifyUser,
  getUsernameFromToken,
} = require('./utils/auth');
const dbLib = require('./model/dbOperations');

// create the express app
const webapp = express();

webapp.use(cors());

webapp.use(express.urlencoded({ extended: true }));
webapp.use(express.json());


webapp.get('/', (req, res) => {
  res.json({ message: 'welcome' });
});

/**
 * route implementation GET /users
 */
webapp.get('/api/users', async (req, resp) => {
  try {
    // get the data from the DB
    const users = await dbLib.getUsers();
    // send response
    resp.status(200).json({ data: users });
  } catch (err) {
    // send the error code
    resp.status(400).json({ message: 'There was an error' });
  }
});

/*
 * Verify that the user and email is not repeated
 *
 */
webapp.post('/api/user/checkUniqueness', async (req, res) => {
  try {
    let repeatedUsername = false;
    let repeatedEmail = false;
    const { email } = req.body;
    // console.log('lol', email);
    const { username } = req.body;
    const { userType } = req.body;
    // we want unique username and email
    const results = await dbLib.getSpecificUser(username, email, userType);
    if (results.length === 0) {
      res.status(200).send({});
    } else {
      results.map((item) => {
        // console.log('my item is', item);
        if (item.username === username) {
          repeatedUsername = true;
        }
        if (item.email === email) {
          repeatedEmail = true;
        }

        return null;
      });
      // console.log(repeatedUsername, repeatedEmail);
      res.status(201).send({
        duplicatedUser: !!repeatedUsername,
        duplicatedEmail: !!repeatedEmail,
      });
    }
  } catch (err) {
    // console.log('error here', err);
    res.status(400).send({ success: false });
  }
});

/*
 * update the user info
 */
webapp.put('/api/user/changeUserInfo', async (req, res) => {
  // const { userInfo } = req.body;
  // const { userType } = req.body;
  try {
    const token = req.headers.authorization;
    const username = await verifyUser(token);
    // console.log(username);
    if (!username) {
      // console.log('user is not logged in');
      res.status(205).send({});
    }
    // const response = dbLib.updateUserInfo(username, userInfo, userType);
    // console.log(response);
    res.send({ username });
  } catch (err) {
    // console.log(err);
    res.status(400).send({});
  }
});

/**
 * route implementation GET /student/:id
 */
webapp.get('/api/users/:id', async (req, res) => {
  try {
    // get the data from the db
    const results = await dbLib.getUser(req.params.id);
    if (results === undefined || results === null) {
      res.status(404).json({ error: 'unknown user' });
      return;
    }
    // send the response with the appropriate status code
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

/**
 * route implementation POST /users
 */
webapp.post('/api/users', async (req, resp) => {
  // parse the body
  if (
    !req.body.username
    || !req.body.address
    || !req.body.state
    || !req.body.city
    || !req.body.zip
    || !req.body.email
    || !req.body.password
    || !req.body.dayJoined
    || !req.body.monthJoined
    || !req.body.yearJoined
  ) {
    resp.status(404).json({ message: 'missing field values in the body' });
    return;
  }
  try {
    // create the new student object
    const userInfo = {
      username: req.body.username,
      address: req.body.address,
      state: req.body.state,
      city: req.body.city,
      zip: req.body.zip,
      email: req.body.email,
      password: req.body.password,
      dayJoined: req.body.dayJoined,
      monthJoined: req.body.monthJoined,
      yearJoined: req.body.yearJoined,
      type: 'user',
      fav_charities: [],
      donation_history: [],
    };

    const result = await dbLib.addUser(userInfo);
    resp.status(201).json({ data: { id: result } });
  } catch (err) {
    resp.status(400).json({ message: 'There was an error' });
  }
});

/**
 * route implementation PUT /users/:id
 */
webapp.put('/api/users/:id', async (req, res) => {
  try {
    // console.log('I was called?');
    const result = await dbLib.updateUserInfo(req.params.id, req.body);
    // send the response with the appropriate status code
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

webapp.get('/api/notifications', async (req, resp) => {
  try {
    const { userId } = req.query;
    // const { type } = req.query;

    const notifications = await dbLib.getNotifications(userId);

    // send response
    resp.status(200).json(notifications || []);
  } catch (err) {
    // send the error code
    resp.status(400).json({ message: 'There was an error' });
  }
});

webapp.post('/api/notifications', async (req, resp) => {
  try {
    // get the data from the DB
    const result = await dbLib.addNotification(req.body);

    // send response
    resp.status(200).json(result);
  } catch (err) {
    // send the error code
    resp.status(400).json({ message: 'There was an error' });
  }
});

/**
 * route implementation GET /charities
 */
webapp.get('/api/charities', async (req, resp) => {
  try {
    // get the data from the DB
    const charities = await dbLib.getCharities();
    // send response
    resp.status(200).json({ data: charities });
  } catch (err) {
    // send the error code
    resp.status(400).json({ message: 'There was an error' });
  }
});

/**
 * route implementation POST /charities
 */
webapp.post('/api/charities', async (req, resp) => {
  // parse the body
  if (
    !req.body.username
    || !req.body.address
    || !req.body.state
    || !req.body.city
    || !req.body.zip
    || !req.body.email
    || !req.body.password
    || !req.body.dayJoined
    || !req.body.monthJoined
    || !req.body.yearJoined
  ) {
    // console.log('rejected :*');
    resp.status(404).json({ message: 'missing field values in the body' });
    return;
  }
  try {
    // create the new student object
    const orgInfo = {
      orgname: req.body.username,
      orgID: req.body.username.toLowerCase().replace(/\s+/g, ''),
      address: req.body.address,
      state: req.body.state,
      city: req.body.city,
      zip: req.body.zip,
      email: req.body.email,
      website: 'https://www.google.com',
      password: req.body.password,
      dayJoined: req.body.dayJoined,
      monthJoined: req.body.monthJoined,
      yearJoined: req.body.yearJoined,
    };

    const result = await dbLib.addCharity(orgInfo);
    // console.log(result);
    resp.status(201).json({ data: result });
  } catch (err) {
    // console.log(err);
    resp.status(400).json({ message: 'There was an error' });
  }
});

/**
 * route implementation GET /charities/:id
 */
webapp.get('/api/charities/:id', async (req, res) => {
  try {
    // get the data from the db
    const charity = await dbLib.getCharityFromName(req.params.id);
    if (charity === undefined || charity === null) {
      res.status(404).json({ error: 'charity not found' });
      return;
    }
    // send the response with the appropriate status code
    res.status(200).json({ data: charity });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

/**
 * route implementation GET /rankedcharities/:rank
 */
webapp.get('/api/rankedcharities/:rank', async (req, res) => {
  try {
    // get the data from the db
    const charity = await dbLib.getCharityFromRank(Number(req.params.rank));
    if (charity === undefined || charity === null) {
      res.status(404).json({ error: 'charity not found' });
      return;
    }
    // send the response with the appropriate status code
    res.status(200).json({ data: charity });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

/**
 * route implementation PUT /charities/:id
 */
webapp.put('/api/charities/:id', async (req, res) => {
  try {
    const result = await dbLib.updateCharityInfo(req.params.id, req.body);

    // send the response with the appropriate status code
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

/**
 * route implementation PUT /rankedcharities/:rank
 */
webapp.put('/api/rankedcharities/:rank', async (req, res) => {
  try {
    // get the data from the db
    const charity = await dbLib.updateRankedCharityInfo(
      Number(req.params.rank),
      req.body,
    );
    if (charity === undefined || charity === null) {
      res.status(404).json({ error: 'charity not found' });
      return;
    }
    // send the response with the appropriate status code
    res.status(200).json({ data: charity });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

/**
 * Endpoint for login
 */
webapp.post('/api/login', async (req, resp) => {
  if (
    !req.body.username
    || req.body.username === ''
    || !req.body.password
    || req.body.password === ''
  ) {
    resp.status(401).json({ error: 'username/password missing or empty' });
    resp.end();
    return;
  }
  // authenticate user
  try {
    const token = authenticateUser(req.body.username, req.body.password);
    // console.log(token);
    const userVerified = await verifyUser(token);
    // console.log(userVerified);
    if (userVerified) {
      resp.status(201).json({ apptoken: token });
      return;
    }
    // console.log('verifyUser was false');
    resp.status(401).json({
      error: 'username and password combination could not be verified',
    });
  } catch (err) {
    resp.status(401).json({ error: 'there was an error' });
  }
});

/**
 * Endpoint for login when token just needs to be verified.
 */
webapp.get('/api/login', async (req, resp) => {
  if (!req.headers.authorization) {
    resp.status(401).json({ error: 'token not provided' });
    resp.end();
    return;
  }
  // verify user
  try {
    const token = req.headers.authorization;
    const userVerified = await verifyUser(token);
    if (userVerified) {
      resp.status(201).json({ apptoken: token });
      return;
    }
    resp.status(401).json({ error: 'user could not be verified' });
  } catch (err) {
    resp.status(401).json({ error: 'there was an error' });
  }
});

/**
 * Endpoint for getting user profile for specific token.
 */
webapp.get('/api/getUserProfile', async (req, resp) => {
  if (!req.headers.authorization) {
    resp.status(401).json({ error: 'token not provided' });
    resp.end();
    return;
  }
  try {
    const token = req.headers.authorization;
    const username = await getUsernameFromToken(token);
    if (username) {
      // ToDo: why are we returning the entire user document
      const profile = await dbLib.getUser(username);
      resp.status(201).json({ profile });
    } else {
      // console.log('i am here');
      resp.status(400).json({ error: 'invalid token provided' });
    }
  } catch (err) {
    resp.status(401).json({ error: 'there was an error' });
  }
});

module.exports = webapp;
