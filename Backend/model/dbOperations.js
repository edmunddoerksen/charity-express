const { MongoClient } = require('mongodb');

// const { ObjectId } = require('mongodb');

const { flatten } = require('mongo-dot-notation');

const dbURL = 'mongodb+srv://charityexpress:charityexpress@cluster0.qh3na8b.mongodb.net/CharityExpress?retryWrites=true&w=majority';

let mongoConnection; // this variable stores the database

const connect = async () => {
  try {
    mongoConnection = await MongoClient.connect(dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    return mongoConnection;
  } catch (err) {
    return null;
  }
};

/**
 *
 * helper that @returns the database attached to this MongoDB connection
 */
const getDB = async (URL) => {
  // test if there is an active connection
  if (!mongoConnection) {
    await connect(URL);
  }
  return mongoConnection.db();
};

const closeConnection = async () => {
  await mongoConnection.close();
};

/*
 * This is intended for usage in EditUserProfilePage (may change later)
 */
const getSpecificUser = async (usernameToCheck, emailToCheck, userType) => {
  try {
    const db = await getDB();
    const result = await db
      .collection('users')
      .find({
        $and: [
          {
            $or: [
              { username: usernameToCheck },
              {
                email: emailToCheck,
              },
            ],
          },
          { type: userType },
        ],
      })
      .toArray();
    return result;
  } catch (err) {
    // console.log(err);
    return err.message;
  }
};

const getUsers = async () => {
  try {
    // get the db
    const db = await getDB();
    const result = await db.collection('users').find({}).toArray();
    return result;
  } catch (err) {
    return null;
  }
};

const getUser = async (usr) => {
  try {
    // get the db
    const db = await getDB();
    const result = await db.collection('users').findOne({ username: usr });
    return result;
  } catch (err) {
    return null;
  }
};

const getNotifications = async (userId) => {
  try {
    // get the db
    const db = await getDB();
    const result = await db
      .collection('notifications')
      .find({ recipientID: userId })
      .toArray();
    return result;
  } catch (err) {
    // console.log(err);
    return err;
  }
};

const addNotification = async (notification) => {
  try {
    // get the db
    const db = await getDB();
    // console.log(notification);
    const result = await db.collection('notifications').insertOne(notification);

    return result;
  } catch (err) {
    return null;
  }
};

const addUser = async (newUser) => {
  try {
    // get the db
    const db = await getDB();
    const result = await db.collection('users').insertOne(newUser);

    return result.insertedId;
  } catch (err) {
    return null;
  }
};

const updateUserInfo = async (currentUsername, userInfo, userType) => {
  try {
    const db = await getDB();
    // console.log('username', currentUsername, 'info', userInfo, 'user', userType);
    const response = db
      .collection('users')
      .updateOne(
        { username: currentUsername, type: userType },
        { $set: userInfo },
      );
    return response;
  } catch (err) {
    // console.log(err);
    return null;
  }
};

/**
 *
 * Functionality to interact with charity data
 * To Do: getCharityFromRank
 */

// get charities function: retrieve all charities
const getCharities = async () => {
  try {
    // get the db
    console.log('jimbo');
    const db = await getDB(dbURL);
    const result = await db.collection('charities').find({}).toArray();
    return result;
  } catch (err) {
    return null;
  }
};

// get a charity that has the inputted id

const getCharityFromName = async (charityId) => {
  try {
    // get the db
    const db = await getDB(dbURL);
    const result = await db
      .collection('charities')
      .findOne({ orgID: charityId });

    return result;
  } catch (err) {
    return null;
  }
};

// get a charity that has the inputted rank

const getCharityFromRank = async (charityRank) => {
  try {
    // get the db
    const db = await getDB(dbURL);
    const result = await db
      .collection('charities')
      .findOne({ rank: charityRank });
    return result;
  } catch (err) {
    return null;
  }
};
const getMaxRank = async () => {
  const db = await getDB();
  try {
    const result = await db
      .collection('charities')
      .aggregate([
        {
          $group: {
            _id: null,
            maxRank: { $max: { $toInt: '$rank' } },
          },
        },
        {
          $project: {
            _id: 0,
            maxRank: 1,
          },
        },
        {
          $limit: 1,
        },
      ])
      .toArray();

    return result[0].maxRank;
  } catch (err) {
    // console.log(err);
    return err.message;
  }
};

const addCharity = async (newOrg) => {
  try {
    // get the db
    const db = await getDB();
    // definitely not the best one to do it because aggregation is very slow

    const maxRank = await getMaxRank();

    newOrg.rank = maxRank + 1;

    const result = await db.collection('charities').insertOne(newOrg);

    return result.insertedId;
  } catch (err) {
    // console.log(err);
    return null;
  }
};

// update the charity info for the charity with inputted id

const updateCharityInfo = async (orgID_, newInfo) => {
  try {
    // _id is immutable and cannot be part of $set
    delete newInfo._id;
    const flattened = flatten(newInfo);
    // console.log(
    //   '[DB updateCharityInfo]',
    //   orgID_,
    //   JSON.stringify(flattened, null, 2),
    // );

    // get the db
    const db = await getDB(dbURL);
    const result = await db.collection('charities').updateOne(
      { orgID: orgID_ },
      flattened, // converts fields to update JSON object into a $set command
    );

    // console.log(
    //   '[DB result updateCharityInfo]',
    //   JSON.stringify(result, null, 2),
    // );
    return result;
  } catch (err) {
    // console.log('[exception updateCharityInfo]', err);
    return null;
  }
};

// update the charity info for the charity with inputted rank

const updateRankedCharityInfo = async (rank_, newInfo) => {
  try {
    const flattened = flatten(newInfo);
    // get the db
    const db = await getDB(dbURL);
    const result = await db.collection('charities').updateOne(
      { rank: rank_ },
      flattened, // converts fields to update JSON object into a $set command
    );

    return result;
  } catch (err) {
    return null;
  }
};

module.exports = {
  connect,
  getDB,
  closeConnection,
  getUsers,
  getUser,
  addUser,
  updateUserInfo,
  getCharities,
  getCharityFromName,
  getCharityFromRank,
  addCharity,
  updateCharityInfo,
  updateRankedCharityInfo,
  addNotification,
  getNotifications,
  getSpecificUser,
};
