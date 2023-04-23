/* eslint-disable no-useless-catch */
class CartsRepository {
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

	async insertMany(newProducts) {
		try {
			return await this.dao.insertMany(newProducts);
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

	async updateOne(data, newData) {
		try {
			return await this.dao.updateOne(data, newData);
		} catch (error) {
			throw error;
		}
	}

	async deleteOne(param) {
		try {
			return await this.dao.deleteOne(param);
		} catch (error) {
			throw error;
		}
	}

	async deleteMany() {
		try {
			return await this.dao.deleteMany();
		} catch (error) {
			throw error;
		}
	}
}

module.exports = CartsRepository;
