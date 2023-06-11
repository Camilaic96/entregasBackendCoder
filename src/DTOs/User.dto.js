const { hashPassword } = require('../utils/bcrypt.utils');
const { v4: uuidV4 } = require('uuid');

class UserDTO {
	constructor(user) {
		this.googleId = user.googleId || '';
		this.first_name = user.first_name;
		this.last_name = user.last_name;
		this.email = user.email || uuidV4() + 'error@email';
		this.age = user.age;
		this.password = hashPassword(user.password);
		this.carts = user.carts;
		this.role = user.role;
		this.documents = user.documents;
		this.last_connection = user.last_connection;
	}
}

module.exports = UserDTO;
