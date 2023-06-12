/* eslint-disable no-useless-catch */
class UsersRepository {
	constructor(dao) {
		this.dao = dao;
	}

	async find() {
		try {
			return await this.dao.find();
		} catch (error) {
			throw error;
		}
	}

	async findOne(param) {
		try {
			return await this.dao.findOne(param);
		} catch (error) {
			throw error;
		}
	}

	async findById(id) {
		try {
			return await this.dao.findById(id);
		} catch (error) {
			throw error;
		}
	}

	async create(newUserInfo) {
		try {
			return await this.dao.create(newUserInfo);
		} catch (error) {
			throw error;
		}
	}

	async updateOne(data, newData) {
		try {
			return await this.dao.updateOne(data, newData);
		} catch (error) {
			throw error;
		}
	}

	async findOneAndUpdate(data, newData) {
		try {
			return await this.dao.findOneAndUpdate(data, newData, { new: true });
		} catch (error) {
			throw error;
		}
	}
}

module.exports = UsersRepository;
