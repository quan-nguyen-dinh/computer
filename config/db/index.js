const mongoose = require('mongoose');
const logger = require('../log/index');
require('dotenv').config();


async function connect() {
  try {
    // eslint-disable-next-line
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('Connect successfully to mongoDB!!!');
  } catch (error) {
    logger.error(error);
  }
}

module.exports = { connect };
