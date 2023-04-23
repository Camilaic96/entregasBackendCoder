const Route = require('../router/router.js');
const Cart = require('../services/carts.service.js');
const Product = require('../services/products.service.js');

const FilesDao = require('../dao/memory/Files.dao.js');
const CartManager = new FilesDao('Carts.json');

class CartRouter extends Route {
	init() {
		this.get('/', async (req, res) => {
			try {
				const carts = await Cart.find();
				res.json({ response: carts });
			} catch (error) {
				if (error.code === 11000)
					return res.sendUserError('The user already exists');
				res.sendServerError(`Something went wrong. ${error}`);
			}
		});

		this.get('/:cid', async (req, res) => {
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
		this.post('/populate', async (req, res) => {
			const carts = await CartManager.loadItems();
			const response = await Cart.insertMany(carts);
			res.json({ message: response });
		});

		this.post('/', async (req, res) => {
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

		this.post('/:cid/products/:pid', async (req, res) => {
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

		this.put('/:cid', async (req, res) => {
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

		this.put('/:cid/products/:pid', async (req, res) => {
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

		this.delete('/:cid/products/:pid', async (req, res) => {
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

		this.delete('/:cid', async (req, res) => {
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
		this.delete('/', async (req, res) => {
			await Cart.deleteMany();
			res.json({ message: 'All carts deleted' });
		});

		this.get('/:cid/purchase', async (req, res) => {
			/*
			Corroborar stock
				- Si el producto tiene suficiente stock para la cantidad indicada en el producto del carrito, entonces restarlo del stock del producto y continuar.
				- Si el producto no tiene suficiente stock para la cantidad indicada en el producto del carrito, entonces no agregar el producto al proceso de compra.
			
			Al final, utilizar el servicio de Tickets para poder generar un ticket con los datos de la compra.
			
			En caso de existir una compra no completada, devolver el arreglo con los ids de los productos que no pudieron procesarse.

			Una vez finalizada la compra, el carrito asociado al usuario que compró deberá contener sólo los productos que no pudieron comprarse. Es decir, se filtran los que sí se compraron y se quedan aquellos que no tenían disponibilidad.
			*/
		});
	}
}

const cartRouter = new CartRouter();
const cartsController = cartRouter.getRouter();

module.exports = cartsController;
