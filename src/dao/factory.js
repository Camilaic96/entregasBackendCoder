const MongoConnect = require('../../db');
const { PERSISTENCE } = require('../config/index');

switch (PERSISTENCE) {
	case 'memory':
		module.exports = require('./memory/Users.memory');
		break;

	case 'mongo':
		MongoConnect.getInstance();
		module.exports = require('./mongo/mongoManager/Users.mongo');
		break;
}
