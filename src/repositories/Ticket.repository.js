/* eslint-disable no-useless-catch */
class TicketsRepository {
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

	async create(newProductInfo) {
		try {
			return await this.dao.create(newProductInfo);
		} catch (error) {
			throw error;
		}
	}
}

module.exports = TicketsRepository;
