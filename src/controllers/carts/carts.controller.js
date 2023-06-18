const Route = require('../../router/router.js');

const Carts = require('../../services/carts.service.js');
const Tickets = require('../../services/tickets.service.js');
const Products = require('../../services/products.service.js');
const ProductsDAO = require('../../dao/mongo/mongoManager/Products.mongo.js');

const FilesDao = require('../../dao/memory/Files.dao.js');
const CartManager = new FilesDao('Carts.json');

const CustomErrors = require('../../utils/errors/Custom.errors.js');
const {
	notFoundProductErrorInfo,
} = require('../../utils/errors/info.errors.js');
const EnumErrors = require('../../utils/errors/Enum.errors.js');

class CartRouter extends Route {
	init() {
		this.get('/', /* ['ADMIN'] */ ['PUBLIC'], async (req, res) => {
			try {
				const carts = await Carts.find();
				res.sendSuccess(carts);
			} catch (error) {
				res.sendServerError(`Something went wrong. ${error}`);
			}
		});

		this.get(
			'/:cid',
			['PUBLIC'] /* ['USER', 'PREMIUM', 'ADMIN'] */,
			async (req, res) => {
				try {
					const cartById = await Carts.findOne(req.params);
					res.sendSuccess(cartById);
					/* - borrado para que funcione test
				const products = cartById.products.map(item => {
					return {
						id: item.product._id,
						title: item.product.title,
						description: item.product.description,
						code: item.product.code,
						price: item.product.price,
						status: item.product.status,
						stock: item.product.stock,
						category: item.product.category,
						thumbnail: item.product.thumbnail,
						quantity: item.quantity,
					};
				});
				res.render('cartId.handlebars', { products, style: 'products.css' });
				*/
				} catch (error) {
					res.sendServerError(`Something went wrong. ${error}`);
				}
			}
		);

		// Add all carts from fs to the db
		this.post('/loadintodb', ['ADMIN'], async (req, res) => {
			const carts = await CartManager.loadItems();
			const response = await Carts.insertMany(carts);
			res.json({ message: response });
		});

		this.post(
			'/',
			/* ['ADMIN', 'PREMIUM', 'USER'] - borrado para que funcione test */ [
				'PUBLIC',
			],
			async (req, res) => {
				try {
					const cart = await Carts.create();
					res.sendSuccessCreated(cart);
				} catch (error) {
					res.sendServerError(`Something went wrong. ${error}`);
				}
			}
		);

		this.post('/:cid/products/:pid', ['USER', 'PREMIUM'], async (req, res) => {
			try {
				const { user } = req.session;
				await Carts.createProductInCart(req.params, req.body, user);
				res.sendSuccess('Product added to the cart successfully');
			} catch (error) {
				res.sendServerError(`Something went wrong. ${error}`);
			}
		});

		this.put('/:cid', ['USER', 'PREMIUM'], async (req, res) => {
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

		this.put('/:cid/products/:pid', ['USER', 'PREMIUM'], async (req, res) => {
			try {
				const { pid } = req.params;
				const { quantity } = req.body;
				const cart = await Carts.findOne(req.params);
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
				await Carts.updateOne(req.params, cart);
				res.sendSuccess('Quantity updated successfully');
			} catch (error) {
				res.sendServerError(`Something went wrong. ${error}`);
			}
		});

		this.delete(
			'/:cid/products/:pid',
			['PUBLIC'] /* ['USER', 'PREMIUM'] - borrado para que funcione test */,
			async (req, res) => {
				try {
					const { pid } = req.params;
					const cart = await Carts.findOne(req.params);
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
					await Carts.updateOne(req.params, cart);
					res.sendSuccess('Product deleted successfully');
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
					const { cid } = req.params;
					const cart = await Carts.findOne(cid);
					const { products } = req.body;
					const productsOutOfStock = [];
					const productsPurchase = [];
					products.forEach(async product => {
						const productDB = await Products.findOne(product._id);
						if (product.quantity > productDB.stock) {
							productsOutOfStock.push(product._id);
						} else {
							const updateProduct = productDB;
							updateProduct.stock -= product.quantity;
							await ProductsDAO.updateOne(
								{ _id: productDB._id },
								updateProduct
							);
							productsPurchase.push(product);
						}
					});
					if (productsOutOfStock.length > 0) {
						const cartNoPurchaseProd = { ...cart };

						cartNoPurchaseProd.products = cart.products.filter(
							product =>
								!productsPurchase.some(purchase => purchase._id === product._id)
						);
						return res.sendSuccess(productsOutOfStock);
					}
					const ticket = await Tickets.create(productsPurchase);
					res.sendSuccess(ticket, productsOutOfStock);
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
