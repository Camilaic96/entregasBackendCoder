const { mode } = require('../config');

switch (mode) {
	case 'development':
		module.exports = require('./dev.logger');
		break;

	case 'production':
		module.exports = require('./prod.logger');
		break;
}
