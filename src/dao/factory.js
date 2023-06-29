/*
const MongoConnect = require('../../db');
const { persistence } = require('../config/index');

switch (persistence) {
	case 'memory':
		module.exports = require('./memory/Users.memory');
		break;
	case 'mongo':
		MongoConnect.getInstance();
		module.exports = {
			UsersDAO: require('./mongo/mongoManager/Users.mongo'),
			ProductsDAO: require('./mongo/mongoManager/Products.mongo'),
			CartsDAO: require('./mongo/mongoManager/Carts.mongo'),
			TicketsDAO: require('./mongo/mongoManager/Tickets.mongo'),
		};
		break;
}
*/
const MongoConnect = require('../../db');
const { persistence } = require('../config/index');

switch (persistence) {
	case 'memory':
		module.exports = require('./memory/Users.memory');
		break;

	case 'mongo':
		MongoConnect.getInstance();
		module.exports = require('./mongo/mongoManager/Users.mongo');
		break;
}
