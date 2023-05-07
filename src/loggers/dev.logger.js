const winston = require('winston');
const customWinstonLevelOptions = require('../config/winston.config');

const logger = winston.createLogger({
	levels: customWinstonLevelOptions.levels,
	transports: [
		new winston.transports.Console({
			level: 'debug',
			format: winston.format.combine(
				winston.format.colorize({ colors: customWinstonLevelOptions.colors }),
				winston.format.simple()
			),
		}),
	],
});

module.exports = logger;
