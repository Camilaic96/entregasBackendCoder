/* eslint-disable no-useless-catch */
const { cartsRepository } = require('../repositories');
const Carts = cartsRepository;

const find = async () => {
	try {
		const carts = await Carts.find();
		return carts;
	} catch (error) {
		throw error;
	}
};

const findOne = async param => {
	try {
		const cart = await Carts.findOne(param);
		return cart;
	} catch (error) {
		throw error;
	}
};

const insertMany = async newCarts => {
	try {
		const carts = await Carts.insertMany(newCarts);
		return carts;
	} catch (error) {
		throw error;
	}
};

const create = async cart => {
	try {
		const newProduct = await Carts.create(cart);
		return newProduct;
	} catch (error) {
		throw error;
	}
};

const updateOne = async (data, newData) => {
	try {
		const updateProduct = await Carts.updateOne(data, newData);
		return updateProduct;
	} catch (error) {
		throw error;
	}
};

const deleteOne = async cart => {
	try {
		const deleteProduct = await Carts.deleteOne(cart);
		return deleteProduct;
	} catch (error) {
		throw error;
	}
};

const deleteMany = async () => {
	try {
		const deleteCarts = await Carts.deleteMany();
		return deleteCarts;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	find,
	findOne,
	insertMany,
	create,
	updateOne,
	deleteOne,
	deleteMany,
};
