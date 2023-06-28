const { v4: uuidV4 } = require('uuid');

class SessionDTO {
	constructor(user) {
		this._id = user._id;
		this.first_name = user.first_name;
		this.last_name = user.last_name;
		this.email = user.email || uuidV4() + 'error@email';
		this.age = user.age;
		this.role = user.role;
	}
}

module.exports = SessionDTO;
