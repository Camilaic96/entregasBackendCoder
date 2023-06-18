/* eslint-disable no-useless-catch */
class TicketsRepository {
	constructor(dao) {
		this.dao = dao;
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
