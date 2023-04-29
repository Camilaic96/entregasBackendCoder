/* eslint-disable no-useless-catch */
const Product = require('../models/Products.model');

class ProductsMongoDAO {
	async find(filter, optionsFind) {
		try {
			const products = await Product.paginate(filter, optionsFind);
			return products;
		} catch (error) {
			throw error;
		}
	}

	async findOne(param) {
		try {
			const product = await Product.findOne(param);
			return product;
		} catch (error) {
			throw error;
		}
	}

	async insertMany(newProducts) {
		try {
			const products = await Product.insertMany(newProducts);
			return products;
		} catch (error) {
			throw error;
		}
	}

	async create(newProduct) {
		try {
			const product = await Product.create(newProduct);
			return product;
		} catch (error) {
			throw error;
		}
	}

	async updateOne(data, newData) {
		try {
			const product = await Product.updateOne(data, newData);
			return product;
		} catch (error) {
			throw error;
		}
	}

	async deleteOne(param) {
		try {
			const product = await Product.deleteOne(param);
			return product;
		} catch (error) {
			throw error;
		}
	}

	async deleteMany() {
		try {
			await Product.deleteMany();
			return 'Products deleted';
		} catch (error) {
			throw error;
		}
	}
}

module.exports = ProductsMongoDAO;
