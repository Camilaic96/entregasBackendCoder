const MongoConnect = require('../../db');
const { persistence } = require('../config/index');
const UsersDAO = require('./mongo/mongoManager/Users.mongo');
const ProductsDAO = require('./mongo/mongoManager/Products.mongo');
const CartsDAO = require('./mongo/mongoManager/Carts.mongo');

switch (persistence) {
	case 'memory':
		module.exports = require('./memory/Users.memory');
		break;
	case 'mongo':
		MongoConnect.getInstance();
		module.exports = {
			UsersDAO,
			ProductsDAO,
			CartsDAO,
		};
		break;
}
