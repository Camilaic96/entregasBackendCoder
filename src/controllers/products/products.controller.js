/* eslint-disable no-unused-vars */
const uploader = require('../../utils/multer.js');
const Route = require('../../router/router.js');

const Products = require('../../services/products.service.js');
const Carts = require('../../services/carts.service.js');

const FilesDao = require('../../dao/memory/Files.dao.js');
const FilesManager = new FilesDao('Products.json');

class ProductRouter extends Route {
	init() {
		this.get('/', ['PUBLIC'], async (req, res) => {
			try {
				const { user } = req.session;
				const cart =
					user.carts.length !== 0
						? user.carts[user.carts.length - 1]
						: await Carts.create();
				const isUser = user.role === 'USER';
				const products = await Products.find(req.query);
				console.log(cart);
				// res.sendSuccess(products);
				res.render('products.handlebars', {
					products,
					user,
					isUser,
					idCart: cart._id,
					style: 'products.css',
				});
			} catch (error) {
				res.sendServerError(`Something went wrong. ${error}`);
			}
		});

		this.get('/realtimeproducts', ['PUBLIC'], async (req, res) => {
			try {
				const products = await Products.find(req.query);
				global.io.emit('showProducts', products);
				res.render('realTimeProducts.handlebars', {
					products,
					style: 'products.css',
				});
			} catch (error) {
				res.sendServerError(`Something went wrong. ${error}`);
			}
		});

		this.get('/:pid', ['PUBLIC'], async (req, res) => {
			try {
				const { user } = req.session;
				const cart =
					user.carts.length !== 0
						? user.carts[user.carts.length - 1]._doc
						: await Carts.create();
				const isUser = user.role === 'USER';
				const product = await Products.findOne(req.params);
				// res.sendSuccess(product);
				res.render('productId.handlebars', {
					product,
					user,
					isUser,
					idCart: cart._id,
					style: 'products.css',
				});
			} catch (error) {
				res.sendServerError(`Something went wrong. ${error}`);
			}
		});

		this.post(
			'/loadintodb',
			['ADMIN'],
			uploader.array('files'),
			async (req, res) => {
				const products = await FilesManager.loadItems();
				const response = await Products.insertMany(products);
				res.json({ message: response });
			}
		);

		this.post(
			'/',
			['ADMIN', 'PREMIUM'],
			uploader.array('files'),
			async (req, res) => {
				try {
					const { user } = req.session;
					const product = await Products.create(req.body, req.files, user);
					res.sendSuccessCreated(product);
					/* - borrado para que funcione test
					await Products.create(req.body, req.files, user);
					const products = await Products.find(req.query); 
					res.render('products.handlebars', { products, user, style: 'products.css' });
					*/
				} catch (error) {
					if (error.code === 2) {
						res.sendUserError(`Something went wrong. ${error.cause}`);
					} else {
						res.sendServerError(`Something went wrong. ${error}`);
					}
				}
			}
		);

		this.post(
			'/realtimeproducts',
			['ADMIN', 'PREMIUM'],
			uploader.array('files'),
			async (req, res) => {
				try {
					const { user } = req.session;
					await Products.create(req.body, req.files, user);
					const products = await Products.find(req.query);
					global.io.emit('showProducts', products);
					res.render('realTimeProducts.handlebars', {
						products,
						style: 'products.css',
					});
				} catch (error) {
					res.sendServerError(`Something went wrong. ${error}`);
				}
			}
		);

		this.put(
			'/realtimeproducts/:pid',
			['ADMIN', 'PREMIUM'],
			uploader.array('files'),
			async (req, res) => {
				try {
					const { user } = req.session;
					await Products.updateOne(req.params, req.body, req.files, user);
					const products = await Products.find(req.query);
					global.io.emit('showProducts', products);
					res.render('realTimeProducts.handlebars', {
						products,
						style: 'products.css',
					});
				} catch (error) {
					res.sendServerError(`Something went wrong. ${error}`);
				}
			}
		);

		this.delete(
			'/realtimeproducts/:pid',
			['ADMIN', 'PREMIUM'],
			async (req, res) => {
				try {
					const { user } = req.session;
					await Products.deleteOne(req.params, user);
					const products = await Products.find(req.query);
					global.io.emit('showProducts', products);
					res.render('realTimeProducts.handlebars', {
						products,
						style: 'products.css',
					});
				} catch (error) {
					res.sendServerError(`Something went wrong. ${error}`);
				}
			}
		);

		// Delete all products bd
		this.delete('/', ['ADMIN'], async (req, res) => {
			await Products.deleteMany();
			res.json({ message: 'All products deleted' });
		});
	}
}

const productRouter = new ProductRouter();
const productsController = productRouter.getRouter();

module.exports = productsController;
