const UsersDao = require('../dao/factory');
const UserRepository = require('./User.repository');

const userRepository = new UserRepository(new UsersDao());

module.exports = userRepository;
