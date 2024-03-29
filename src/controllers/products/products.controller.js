const uploader = require('../../utils/multer.js');
const Route = require('../../router/router.js');

const Products = require('../../services/products.service.js');

const FilesDao = require('../../dao/memory/Files.dao.js');
const FilesManager = new FilesDao('Products.json');

class ProductRouter extends Route {
	init() {
		this.get('/', ['PUBLIC'], async (req, res) => {
			try {
				const { user } = req.session;
				const products = await Products.find(req.query);
				if (user) {
					const idCart = user.carts._id || user.carts;
					const isUser = user.role === 'USER';

					res.render('products.handlebars', {
						products,
						user,
						isUser,
						idCart,
						style: 'products.css',
					});
				} else {
					res.render('products.handlebars', {
						products,
						style: 'products.css',
					});
				}
				// res.sendSuccess(products);
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
				const product = await Products.findOne(req.params);
				if (user) {
					res.render('productId.handlebars', {
						product,
						user,
						isUser: user.role === 'USER',
						idCart: user.carts._id || user.carts,
						style: 'productId.css',
					});
				} else {
					res.render('productId.handlebars', {
						product,
						style: 'productId.css',
					});
				}
				// res.sendSuccess(product);
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
