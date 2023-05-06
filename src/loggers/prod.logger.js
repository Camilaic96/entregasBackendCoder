const winston = require('winston');
const customWinstonLevelOptions = require('../config/winston.config');

const logger = winston.createLogger({
	levels: customWinstonLevelOptions.levels,
	transports: [
		new winston.transports.File({
			filename: './src/files/logs/errors.log',
			level: 'info',
			format: winston.format.simple(),
		}),
	],
});

module.exports = logger;
