/* eslint-disable no-useless-catch */
const { cartsRepository } = require('../repositories');
const Carts = cartsRepository;
const CustomErrors = require('../utils/errors/Custom.errors');
const { notFoundCartErrorInfo } = require('../utils/errors/info.errors');
const EnumErrors = require('../utils/errors/Enum.errors');

const find = async () => {
	try {
		const carts = await Carts.find();
		return carts;
	} catch (error) {
		throw error;
	}
};

const findOne = async params => {
	try {
		const { cid } = params;
		const cart = await Carts.findOne({ _id: cid });
		if (!cart) {
			CustomErrors.createError({
				name: 'Cart not found in database',
				cause: notFoundCartErrorInfo(cid),
				message: 'Error trying to find cart',
				code: EnumErrors.NOT_FOUND,
			});
		}
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

const create = async () => {
	try {
		const newProduct = await Carts.create();
		return newProduct;
	} catch (error) {
		throw error;
	}
};

const updateOne = async (params, products) => {
	try {
		const { cid } = params;
		const updateProduct = await Carts.updateOne(cid, products);
		return updateProduct;
	} catch (error) {
		throw error;
	}
};

const deleteOne = async params => {
	try {
		const { cid } = params;
		const deleteCart = await Carts.deleteOne({ _id: cid });
		if (!deleteCart) {
			CustomErrors.createError({
				name: 'Cart not found in database',
				cause: notFoundCartErrorInfo(cid),
				message: 'Error trying to delete cart',
				code: EnumErrors.NOT_FOUND,
			});
		}
		return deleteCart;
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
