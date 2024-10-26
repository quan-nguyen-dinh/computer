const mongoose = require('mongoose');
require('dotenv').config();

async function connect() {
  try {
    // eslint-disable-next-line
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connect successfully to mongoDB!!!');
  } catch (error) {
    console.log('Connect failure!!!', error);
  }
}

module.exports = { connect };
