const Cart = require('../models/Carts.model');

class CartDao {
	constructor(file) {
		this.file = `${process.cwd()}/src/files/${file}`;
	}

	async find() {
		try {
			const carts = await Cart.find();
			return carts;
		} catch (error) {
			return error;
		}
	}

	async findOne(param) {
		try {
			const cart = await Cart.findOne(param);
			return cart;
		} catch (error) {
			return error;
		}
	}

	async insertMany(newCarts) {
		try {
			const carts = await Cart.insertMany(newCarts);
			return carts;
		} catch (error) {
			return error;
		}
	}

	async create(newCart) {
		try {
			await Cart.create(newCart);
			return 'Cart created';
		} catch (error) {
			return error;
		}
	}

	async updateOne(cartId, newProducts) {
		try {
			const cart = await Cart.findOne({ id: cartId });
			cart.products = newProducts;
			const response = Cart.updateOne({ id: cartId }, cart);
			return response;
		} catch (error) {
			return error;
		}
	}

	async deleteOne(param) {
		try {
			const cart = await Cart.deleteOne(param);
			return cart;
		} catch (error) {
			return error;
		}
	}

	async deleteMany() {
		try {
			await Cart.deleteMany();
			return 'Carts deleted';
		} catch (error) {
			return error;
		}
	}
}

module.exports = CartDao;
