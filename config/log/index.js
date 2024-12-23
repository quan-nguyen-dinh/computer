const winston = require('winston');
const path = require('path');

module.exports = winston.createLogger({
    format: winston.format.combine(
        winston.format.splat(),
        winston.format.timestamp({
            format: 'HH:mm:ss DD/MM/YYYY'
        }),
        winston.format.colorize(),
        winston.format.printf(
            log => {
                // console.log(JSON.stringify(log, ''));
                // if (log.level.includes('error')) `[${log.timestamp}] [${log.level}] ${log.name} ${log.message}`
                return `[${log.timestamp}] [${log.level}] ${log.message}`;
            },
        ),
    ),
    transports: [
        new winston.transports.Console,
        new winston.transports.File({
            level: 'error',
            filename: path.join(__dirname, 'errors.log')
        })
    ]
});