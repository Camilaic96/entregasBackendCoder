/* eslint-disable no-unused-vars */
const uploader = require('../utils/multer.js');
const Route = require('../router/router.js');

const Products = require('../services/products.service.js');

const FilesDao = require('../dao/memory/Files.dao.js');
const FilesManager = new FilesDao('Products.json');

class ProductRouter extends Route {
	init() {
		this.get('/', ['PUBLIC'], async (req, res) => {
			try {
				const { user } = req.session;
				const products = await Products.find(req.query);
				console.log('entra a controller');
				res.render('home.handlebars', { products, user, style: 'home.css' });
			} catch (error) {
				console.log('entra a error controller');
				res.sendServerError(`Something went wrong. ${error}`);
			}
		});

		this.get('/realtimeproducts', ['PUBLIC'], async (req, res) => {
			try {
				const products = await Products.find(req.query);
				global.io.emit('showProducts', products);
				res.render('realTimeProducts.handlebars', {
					products,
					style: 'home.css',
				});
			} catch (error) {
				res.sendServerError(`Something went wrong. ${error}`);
			}
		});

		this.get('/:pid', ['PUBLIC'], async (req, res) => {
			try {
				const product = await Products.findOne(req.params);
				res.render('productId.handlebars', { product, style: 'productId.css' });
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

		this.post('/', ['ADMIN'], uploader.array('files'), async (req, res) => {
			try {
				const { user } = req.session;
				await Products.create(req.body, req.files);
				const products = await Products.find(req.query);
				res.render('home.handlebars', { products, user, style: 'home.css' });
			} catch (error) {
				res.sendServerError(`Something went wrong. ${error}`);
			}
		});

		this.post(
			'/realtimeproducts',
			['ADMIN'],
			uploader.array('files'),
			async (req, res) => {
				try {
					await Products.create(req.body, req.files);
					const products = await Products.find(req.query);
					global.io.emit('showProducts', products);
					res.render('realTimeProducts.handlebars', {
						products,
						style: 'home.css',
					});
				} catch (error) {
					res.sendServerError(`Something went wrong. ${error}`);
				}
			}
		);

		this.put(
			'/realtimeproducts/:pid',
			['ADMIN'],
			uploader.array('files'),
			async (req, res) => {
				try {
					await Products.updateOne(req.params, req.body, req.files);
					const products = await Products.find(req.query);
					global.io.emit('showProducts', products);
					res.render('realTimeProducts.handlebars', {
						products,
						style: 'home.css',
					});
				} catch (error) {
					res.sendServerError(`Something went wrong. ${error}`);
				}
			}
		);

		this.delete('/realtimeproducts/:pid', ['ADMIN'], async (req, res) => {
			try {
				await Products.deleteOne(req.params);
				const products = await Products.find(req.query);
				global.io.emit('showProducts', products);
				res.render('realTimeProducts.handlebars', {
					products,
					style: 'home.css',
				});
			} catch (error) {
				res.sendServerError(`Something went wrong. ${error}`);
			}
		});

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
