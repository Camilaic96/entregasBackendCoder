const Cart = require('../models/Carts.model');

class CartsMongoDAO {
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
			const cart = await Cart.create(newCart);
			return cart;
		} catch (error) {
			return error;
		}
	}

	async updateOne(cartId, newCart) {
		try {
			const response = Cart.updateOne({ _id: cartId }, newCart);
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
const Carts = new CartsMongoDAO();
module.exports = Carts;
