const logger = require('../config/log');
function errorHandlingMiddeware(error, _, res, _next) {
    if (error.name === 'BaseError' && error.message) {
        res.status(error.status).json({ message: error.message });
        return;
    }
    logger.error(error);
    res.status(500).json({ message: 'Something went really wrong, please contact support.' });
}

module.exports = {
    errorHandlingMiddeware
}