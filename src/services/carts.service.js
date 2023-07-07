/* eslint-disable no-useless-catch */
const Carts = require('../dao/mongo/mongoManager/Carts.mongo');
const CustomErrors = require('../utils/errors/Custom.errors');
const {
	notFoundProductErrorInfo,
	notFoundCartErrorInfo,
} = require('../utils/errors/info.errors');
const EnumErrors = require('../utils/errors/Enum.errors');
const Products = require('./products.service');
const Tickets = require('./tickets.service.js');

const SendEmail = require('../utils/email.utils.js');

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
			CustomErrors.createError({
				name: 'Cart not found in database',
				cause: notFoundCartErrorInfo(cid),
				message:
					'Error trying to add product to cart. You are not authorized to add a product of your authorship to the cart',
				code: EnumErrors.NOT_FOUND,
			});
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

const updateQuantity = async (params, body) => {
	const { pid, cid } = params;
	const { quantity } = body;
	const cart = await Carts.findOne({ _id: cid });
	const index = cart.products.findIndex(
		element => element.product._id.toString() === pid
	);
	if (index === -1) {
		CustomErrors.createError({
			name: 'Product not found in cart',
			cause: notFoundProductErrorInfo(pid),
			message: 'Error trying to find product',
			code: EnumErrors.NOT_FOUND,
		});
	}
	cart.products[index].quantity = quantity;
	await Carts.updateOne(cid, cart);
	return 'product updated';
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

const deleteOneProductOfCart = async params => {
	const { pid, cid } = params;
	const cart = await Carts.findOne({ _id: cid });
	const index = cart.products.findIndex(
		element => element.product._id.toString() === pid
	);
	if (index === -1) {
		CustomErrors.createError({
			name: 'Product not found in cart',
			cause: notFoundProductErrorInfo(pid),
			message: 'Error trying to delete product',
			code: EnumErrors.NOT_FOUND,
		});
	}
	cart.products.splice(index, 1);
	await Carts.updateOne(cid, cart);
	return 'Product deleted';
};

const deleteMany = async () => {
	try {
		const deleteCarts = await Carts.deleteMany();
		return deleteCarts;
	} catch (error) {
		throw error;
	}
};

const createPurchase = async (user, params) => {
	const { cid } = params;
	const cart = await Carts.findOne({ _id: cid });
	const products = cart.products.map(product => {
		return {
			_id: product.product._id.toString(),
			quantity: product.quantity,
		};
	});
	const productsOutOfStock = [];
	const productsPurchase = [];
	for (let i = 0; i < products.length; i++) {
		const product = products[i];
		params.pid = product._id;
		const productDB = await Products.findOne(params);
		if (!productDB || product.quantity > productDB.stock) {
			productsOutOfStock.push(product);
		} else {
			const updateProduct = {
				stock: productDB.stock - product.quantity,
			};
			await Products.updateQuantity({ _id: product._id }, updateProduct, {
				new: true,
			});
			product.price = productDB.price;
			productsPurchase.push(product);
		}
	}
	if (productsPurchase.length === 0) {
		CustomErrors.createError({
			name: 'Product not found in cart',
			cause: notFoundProductErrorInfo(cid),
			message: 'Error trying to find product',
			code: EnumErrors.NOT_FOUND,
		});
	}
	const t = await Tickets.create(productsPurchase, user.email);
	SendEmail.sendEmail(
		user.email,
		'Purchase receipt',
		`Purchase successfully completed. Reference code: ${t.code}`
	);
	cart.products = [];

	const productsOutOfStockFormatted = productsOutOfStock.map(product => {
		return {
			product: product._id,
			quantity: product.quantity,
		};
	});

	cart.products.push(...productsOutOfStockFormatted);
	await Carts.updateOne(cid, cart);
	const ticket = {
		code: t.code,
		purchase_datetime: t.purchase_datetime,
		amount: t.amount,
		purchaser: t.purchaser,
	};
	const response = {
		ticket,
		productsOutOfStock,
		productsPurchase,
	};
	return response;
};

module.exports = {
	find,
	findOne,
	insertMany,
	create,
	createProductInCart,
	updateOne,
	updateQuantity,
	deleteOne,
	deleteOneProductOfCart,
	deleteMany,
	createPurchase,
};
