/**
 * utility functions for testing
 */

const insertTestDataToDB = async (db, collection, testData) => {
  const result = await db.collection(collection).insertOne(testData);

  if (result.acknowledged) {
    let info;
    if (collection === 'users') {
      info = {
        username: testData.username,
        id: result.insertedId,
      };
    }
    if (collection === 'charities') {
      info = {
        orgID: testData.orgID,
        rank: testData.rank,
        id: result.insertedId,
      };
    }

    return info;
  }

  return null;
};

const deleteTestDataFromDB = async (db, collection, testData) => {
  try {
    let result;

    if (collection === 'users') {
      result = await db.collection(collection).deleteMany({ username: testData });
    } else if (collection === 'charities') {
      result = await db.collection(collection).deleteMany({ orgID: testData });
    }

    const { deletedCount } = result;

    if (deletedCount === 1) {
      return 1;
    }

    return null;
  } catch (err) {
    return null;
  }
};

const testUser = {
  username: 'testuser',
  address: '1 Philly Way',
  state: 'PA',
  city: 'Philadelphia',
  zip: '19104',
  email: 'testuser@email.com',
  password: 'testtest',
  dayJoined: 1,
  monthJoined: 1,
  yearJoined: 2023,
  type: 'user',
  fav_charities: [],
  donation_history: [],
};

const testCharity = {
  orgname: 'Test Charity',
  orgID: 'testcharity',
  email: 'testcharity@email.com',
  address: '1 Philly Way',
  location: 'Key Largo, FL',
  city: 'Key Largo',
  state: 'FL',
  coordinates: { lat: 31.19, lng: -77.77 },
  website: 'https://',
  social_medias: [
    {
      social_media: 'twitter',
      link: 'https://twitter.com/redux/',
    },
    {
      social_media: 'instagram',
      link: 'https://www.instagram.com/redux/',
    },
  ],
  imgID: '1_BYSWEFnZ9G69PTJL5hGpO1lxw7nIIBT',
  tag: 'Relief',
  rating: '5 Stars',
  size: 'Large',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vulputate…',
  purpose: 'Sed imperdiet ullamcorper sapien, a aliquet dolor gravida nec. Quisque…',
  items: [
    {
      item: 'Winter Jackets',
      needed: 50,
      received: 31,
    },
    {
      item: 'Boots',
      needed: 50,
      received: 23,
    },
    {
      item: 'Canned Soup',
      needed: 50,
      received: 45,
    },
  ],
  rank: 10,
};

const isInUserArray = (arr, val) => {
  let value = false;
  arr.map((x) => {
    if (String(x.username) === String(val)) {
      value = true;
    }

    return null;
  });
  return value;
};

const isInOrgArray = (arr, val) => {
  let value = false;
  arr.map((x) => {
    if (String(x.orgID) === String(val)) {
      value = true;
    }

    return null;
  });
  return value;
};

// export the functions
module.exports = {
  insertTestDataToDB,
  deleteTestDataFromDB,
  testUser,
  testCharity,
  isInUserArray,
  isInOrgArray,
};
