const { hashPassword } = require('../utils/bcrypt.utils');

class UserDTO {
	constructor(user) {
		this.first_name = user.name;
		this.last_name = user.lastname;
		this.age = user.age;
		this.email = user.email;
		this.password = hashPassword(user.password);
		this.role = user.role;
		this.carts = user.carts;
	}
}

module.exports = UserDTO;
