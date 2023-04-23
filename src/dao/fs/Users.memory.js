/* eslint-disable no-useless-catch */

class UsersMemoryDAO {
	constructor() {
		this.data = [];
	}

	async find() {
		try {
			return this.data;
		} catch (error) {
			throw error;
		}
	}

	/*
	async findOne(param) {
		try {

		} catch (error) {
			throw error;
		}
	}

	async findById(id) {
		try {

		} catch (error) {
			throw error;
		}
	}
*/
	async create(newUser) {
		try {
			this.push.data(newUser);
			return newUser;
		} catch (error) {
			throw error;
		}
	}
	/*
	async updateOne(data, newData) {
		try {

		} catch (error) {
			throw error;
		}
	} */
}

module.exports = UsersMemoryDAO;
