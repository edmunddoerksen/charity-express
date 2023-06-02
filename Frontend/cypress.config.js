const { defineConfig } = require('cypress');

const { MongoClient } = require('mongodb');

const dbURL = 'mongodb+srv://charityexpress:charityexpress@cluster0.qh3na8b.mongodb.net/CharityExpress?retryWrites=true&w=majority';

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on) {
      // implement node event listeners here
      on('task', {
        async deleteUser(usr) {
          const client = await MongoClient.connect(dbURL);
          const db = client.db();
          const collection = db.collection('users');
          await collection.deleteMany({ username: usr });
          await client.close();
          return null;
        },
      });
    },
  },
});
