const Route = require('../../router/router.js');

const Carts = require('../../services/carts.service.js');

const FilesDao = require('../../dao/memory/Files.dao.js');
const CartManager = new FilesDao('Carts.json');

const ProductCartDTO = require('../../DTOs/ProductCart.dto.js');

class CartRouter extends Route {
	init() {
		this.get('/', ['PUBLIC'], async (req, res) => {
			try {
				const carts = await Carts.find();
				res.sendSuccess(carts);
			} catch (error) {
				res.sendServerError(`Something went wrong. ${error}`);
			}
		});

		this.get('/:cid', ['USER', 'PREMIUM', 'ADMIN'], async (req, res) => {
			try {
				const { user } = req.session;
				const cartById = await Carts.findOne(req.params);
				// res.sendSuccess(cartById);
				const products = cartById.products.map(item => {
					return new ProductCartDTO(item);
				});
				res.render('cartId.handlebars', {
					products,
					cartId: cartById._id,
					user,
					style: 'cartId.css',
				});
			} catch (error) {
				res.sendServerError(`Something went wrong. ${error}`);
			}
		});

		// Add all carts from fs to the db
		this.post('/loadintodb', ['ADMIN'], async (req, res) => {
			const carts = await CartManager.loadItems();
			const response = await Carts.insertMany(carts);
			res.json({ message: response });
		});

		this.post('/', ['ADMIN', 'PREMIUM', 'USER'], async (req, res) => {
			try {
				const cart = await Carts.create();
				res.sendSuccessCreated(cart);
			} catch (error) {
				res.sendServerError(`Something went wrong. ${error}`);
			}
		});

		this.post(
			'/:cid/products/:pid',
			['USER', 'PREMIUM', 'ADMIN'],
			async (req, res) => {
				try {
					const { cid } = req.params;
					const { user } = req.session;
					await Carts.createProductInCart(req.params, req.body, user);
					res.redirect(303, `/api/carts/${cid}`);
					// res.sendSuccess('Product added to the cart successfully');
				} catch (error) {
					res.sendServerError(`Something went wrong. ${error}`);
				}
			}
		);

		this.put('/:cid', ['USER', 'PREMIUM', 'ADMIN'], async (req, res) => {
			try {
				const { products } = req.body;
				const cart = await Carts.findOne(req.params);
				products.forEach(product => {
					cart.products.push(product);
				});
				await Carts.updateOne(req.params, cart);
				res.sendSuccess('Cart updated successfully');
			} catch (error) {
				res.sendServerError(`Something went wrong. ${error}`);
			}
		});

		this.put(
			'/:cid/products/:pid',
			['USER', 'PREMIUM', 'ADMIN'],
			async (req, res) => {
				try {
					await Carts.updateQuantity(req.params, req.body);
					res.sendSuccess('Quantity updated successfully');
				} catch (error) {
					res.sendServerError(`Something went wrong. ${error}`);
				}
			}
		);

		this.delete(
			'/:cid/products/:pid',
			['USER', 'PREMIUM', 'ADMIN'],
			async (req, res) => {
				try {
					const { cid } = req.params;
					await Carts.deleteOneProductOfCart(req.params);
					res.redirect(303, `/api/carts/${cid}`);
					// res.sendSuccess('Product successfully removed from the cart.');
				} catch (error) {
					res.sendServerError(`Something went wrong. ${error}`);
				}
			}
		);

		this.delete('/:cid', ['USER', 'PREMIUM', 'ADMIN'], async (req, res) => {
			try {
				await Carts.deleteOne(req.params);
				res.sendSuccess('Cart deleted successfully');
			} catch (error) {
				res.sendServerError(`Something went wrong. ${error}`);
			}
		});

		// Delete all carts db
		this.delete('/', ['ADMIN'], async (req, res) => {
			await Carts.deleteMany();
			res.json({ message: 'All carts deleted' });
		});

		this.get(
			'/:cid/purchase',
			['USER', 'PREMIUM', 'ADMIN'],
			async (req, res) => {
				try {
					const { user } = req.session;
					const { ticket, productsOutOfStock, productsPurchase } =
						await Carts.createPurchase(user, req.params);
					res.render('ticket.handlebars', {
						user,
						ticket,
						productsOutOfStock,
						productsPurchase,
						style: 'ticket.css',
					});
					// res.sendSuccess(ticket, productsOutOfStock);
				} catch (error) {
					res.sendServerError(`Something went wrong. ${error}`);
				}
			}
		);
	}
}

const cartRouter = new CartRouter();
const cartsController = cartRouter.getRouter();

module.exports = cartsController;
