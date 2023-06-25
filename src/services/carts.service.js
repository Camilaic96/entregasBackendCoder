/* eslint-disable no-useless-catch */
const { cartsRepository } = require('../repositories');
const Carts = cartsRepository;
const CustomErrors = require('../utils/errors/Custom.errors');
const { notFoundCartErrorInfo } = require('../utils/errors/info.errors');
const EnumErrors = require('../utils/errors/Enum.errors');
const Products = require('./products.service');

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
		if (!cart._id) {
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
		const cart = await Carts.create();
		return cart;
	} catch (error) {
		throw error;
	}
};

const createProductInCart = async (params, body, user) => {
	try {
		const { pid, cid } = params;
		const product = await Products.findOne(params);
		if (user.role === 'PREMIUM' && user.email === product.owner) {
			return 'You are not authorized to add a product of your authorship to the cart';
		}
		const cart = await Carts.findOne({ _id: cid });
		const { quantity } = body;
		const index = cart.products.findIndex(
			element => element.product._id.toString() === pid
		);
		if (index !== -1) {
			cart.products[index].quantity += quantity;
		} else {
			const newProduct = {
				product: product._id,
				quantity,
			};
			cart.products.push(newProduct);
		}
		await Carts.updateOne(cid, cart);
		const updateCart = await Carts.findOne({ _id: cid });
		return updateCart;
	} catch (error) {}
};

const updateOne = async (params, cart) => {
	try {
		const { cid } = params;
		const updateProduct = await Carts.updateOne(cid, cart);
		return updateProduct;
	} catch (error) {
		throw error;
	}
};

const deleteOne = async params => {
	try {
		const { cid } = params;
		const deleteCart = await Carts.deleteOne({ _id: cid });
		if (!deleteCart._id) {
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
	createProductInCart,
	updateOne,
	deleteOne,
	deleteMany,
};
