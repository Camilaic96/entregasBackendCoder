const { v4: uuidV4 } = require('uuid');

class UserDTO {
	constructor(user) {
		this._id = user._id;
		this.googleId = user.googleId || '';
		this.first_name = user.first_name;
		this.last_name = user.last_name;
		this.email = user.email || uuidV4() + 'error@email';
		this.age = user.age;
		this.password = user.password;
		this.carts = user.carts;
		this.role = user.role || 'USER';
		this.documents = user.documents || [];
		this.last_connection = user.last_connection || {
			register_date: Date(),
			login_date: Date(),
			logout_date: Date(),
		};
	}
}

module.exports = UserDTO;
