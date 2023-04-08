/* eslint-disable no-useless-catch */
const User = require('../../models/Users.model');

class UserDao {
	async find() {
		try {
			const users = await User.find();
			return users;
		} catch (error) {
			throw error;
		}
	}

	async findOne(param) {
		try {
			const user = await User.findOne(param);
			return user;
		} catch (error) {
			throw error;
		}
	}

	async findById(id) {
		try {
			const user = await User.findById(id);
			return user;
		} catch (error) {
			throw error;
		}
	}

	async create(newUser) {
		try {
			const user = await User.create(newUser);
			return user;
		} catch (error) {
			throw error;
		}
	}

	async updateOne(data, newData) {
		try {
			const user = await User.updateOne(data, newData);
			return user;
		} catch (error) {
			throw error;
		}
	}
}

module.exports = UserDao;
