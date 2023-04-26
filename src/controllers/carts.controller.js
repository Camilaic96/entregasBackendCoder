const Route = require('../router/router.js');
const Cart = require('../services/carts.service.js');
const Product = require('../services/products.service.js');

const FilesDao = require('../dao/memory/Files.dao.js');
const CartManager = new FilesDao('Carts.json');

class CartRouter extends Route {
	init() {
		this.get('/', ['PUBLIC'], async (req, res) => {
			try {
				const carts = await Cart.find();
				res.json({ response: carts });
			} catch (error) {
				if (error.code === 11000)
					return res.sendUserError('The user already exists');
				res.sendServerError(`Something went wrong. ${error}`);
			}
		});

		this.get('/:cid', ['PUBLIC'], async (req, res) => {
			try {
				const { cid } = req.params;
				const cartById = await Cart.findOne({ _id: cid });
				if (!cartById) {
					return res.status(400).json({ error: 'Cart not found' });
				}
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

				res.render('cartId.handlebars', { products });
			} catch (error) {
				if (error.code === 11000)
					return res.sendUserError('The user already exists');
				res.sendServerError(`Something went wrong. ${error}`);
			}
		});

		// Add all carts from fs to the database
		this.post('/populate', ['ADMIN'], async (req, res) => {
			const carts = await CartManager.loadItems();
			const response = await Cart.insertMany(carts);
			res.json({ message: response });
		});

		this.post('/', ['USER'], async (req, res) => {
			try {
				const { products, newCart } = req.body;
				for (let i = 0; i < products.length; i++) {
					if (!(await Cart.findOne({ id: products[i]._id }))) {
						return res.status(400).json({ error: 'Invalid products' });
					}
				}
				const response = await Cart.create(newCart);

				res.json({ message: response });
			} catch (error) {
				if (error.code === 11000)
					return res.sendUserError('The user already exists');
				res.sendServerError(`Something went wrong. ${error}`);
			}
		});

		this.post('/:cid/products/:pid', ['USER'], async (req, res) => {
			try {
				const { cid, pid } = req.params;
				const { quantity } = req.body;
				if (
					!quantity ||
					parseInt(quantity) < 1 ||
					!(await Cart.findOne({ _id: cid })) ||
					!(await Product.findOne({ _id: pid }))
				) {
					return res.status(400).json({ error: 'Invalid data' });
				}
			} catch (error) {
				if (error.code === 11000)
					return res.sendUserError('The user already exists');
				res.sendServerError(`Something went wrong. ${error}`);
			}
		});

		this.put('/:cid', ['USER'], async (req, res) => {
			try {
				const { cid } = req.params;
				const { products } = req.body;

				await Cart.updateOne(cid, products);

				res.json({ message: 'Cart modified' });
			} catch (error) {
				if (error.code === 11000)
					return res.sendUserError('The user already exists');
				res.sendServerError(`Something went wrong. ${error}`);
			}
		});

		this.put('/:cid/products/:pid', ['USER'], async (req, res) => {
			try {
				const { cid, pid } = req.params;
				const { quantity } = req.body;
				const cart = await Cart.findOne({ _id: cid });
				const newData = cart.products.map(product => {
					if (product._id === pid) {
						product.quantity = parseInt(quantity);
					}
					return product;
				});
				await Cart.updateOne(cid, newData);
				res.json({ message: 'Product modified' });
			} catch (error) {
				if (error.code === 11000)
					return res.sendUserError('The user already exists');
				res.sendServerError(`Something went wrong. ${error}`);
			}
		});

		this.delete('/:cid/products/:pid', ['USER'], async (req, res) => {
			try {
				const { cid, pid } = req.params;
				const cart = await Cart.findOne({ _id: cid });
				const newProducts = cart.products.filter(
					product => product._id !== pid
				);
				await Cart.updateOne(cid, newProducts);
				res.json({ message: 'Product deleted' });
			} catch (error) {
				if (error.code === 11000)
					return res.sendUserError('The user already exists');
				res.sendServerError(`Something went wrong. ${error}`);
			}
		});

		this.delete('/:cid', ['USER'], async (req, res) => {
			try {
				const { cid } = req.params;
				await Cart.deleteOne({ _id: cid });
				res.json({ message: 'Cart deleted' });
			} catch (error) {
				if (error.code === 11000)
					return res.sendUserError('The user already exists');
				res.sendServerError(`Something went wrong. ${error}`);
			}
		});

		// Delete all carts bd
		this.delete('/', ['ADMIN'], async (req, res) => {
			await Cart.deleteMany();
			res.json({ message: 'All carts deleted' });
		});

		this.get('/:cid/purchase', ['USER'], async (req, res) => {
			try {
				const { products } = req.body; // products array de productos que llegan con id y quantity
				const productsOutOfStock = [];
				products.forEach(async product => {
					const productBD = await Cart.findOne(product._id);
					if (product.quantity > productBD.stock) {
						productsOutOfStock.push(product);
					} else {
						await Cart.updateOne(productBD, productBD.stock - product.quantity);
					}
					if (productsOutOfStock.length > 0) {
						return res.sendSuccess(productsOutOfStock);
					}
					return res.sendSuccess('Successful purchase');
				});
			} catch (error) {
				res.sendServerError(`Something went wrong. ${error}`);
			}
		});
	}
}

const cartRouter = new CartRouter();
const cartsController = cartRouter.getRouter();

module.exports = cartsController;
