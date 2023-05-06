const { mode } = require('../config');

switch (mode) {
	case 'development':
		console.log('devLog');
		module.exports = require('./dev.logger');
		break;

	case 'production':
		console.log('prodLog');
		module.exports = require('./prod.logger');
		break;
}
