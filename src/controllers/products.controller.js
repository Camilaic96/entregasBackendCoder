/* eslint-disable no-unused-vars */
const uploader = require('../utils/multer.js');
const Route = require('../router/router.js');

const Products = require('../services/products.service.js');
const ProductDTO = require('../DTOs/Product.dto.js');
const FilesDao = require('../dao/memory/Files.dao.js');
const FilesManager = new FilesDao('Products.json');

class ProductRouter extends Route {
	init() {
		this.get('/', ['PUBLIC'], async (req, res) => {
			try {
				const { user } = req.session;
				const products = await Products.find(req.query);
				res.render('home.handlebars', { products, user, style: 'home.css' });
			} catch (error) {
				if (error.code === 11000)
					return res.sendUserError('The user already exists');
				res.sendServerError(`Something went wrong. ${error}`);
			}
		});

		this.get('/realtimeproducts', ['PUBLIC'], async (req, res) => {
			try {
				const products = await Products.find(req.query);
				global.io.emit('mostrarProductos', products);
				res.render('realTimeProducts.handlebars', { products });
			} catch (error) {
				if (error.code === 11000)
					return res.sendUserError('The user already exists');
				res.sendServerError(`Something went wrong. ${error}`);
			}
		});

		this.get('/:pid', ['PUBLIC'], async (req, res) => {
			try {
				const { pid } = req.params;
				const productBd = await Products.findOne({ _id: pid });
				if (!productBd) {
					return res.status(400).json({ error: 'Products not found' });
				}
				const product = new ProductDTO(productBd);
				res.render('productId.handlebars', { product, style: 'productId.css' });
			} catch (error) {
				if (error.code === 11000)
					return res.sendUserError('The user already exists');
				res.sendServerError(`Something went wrong. ${error}`);
			}
		});

		this.post(
			'/populate',
			['PUBLIC'],
			uploader.array('files'),
			async (req, res) => {
				const products = await FilesManager.loadItems();
				const response = await Products.insertMany(products);
				res.json({ message: response });
			}
		);

		this.post('/', ['ADMIN'], uploader.array('files'), async (req, res) => {
			try {
				const {
					title,
					description,
					code,
					price,
					status,
					stock,
					category,
					thumbnails,
				} = req.body;
				if (!title || !description || !code || !price || !stock || !category) {
					return res.status(400).json({ error: 'Incomplete data' });
				}
				const newProduct = {
					title,
					description,
					code,
					price,
					status,
					stock,
					category,
				};
				newProduct.thumbnails = [];
				if (req.files) {
					req.files.map(file => newProduct.thumbnails.push(file.path));
				}
				const response = await Products.create(newProduct);

				res.json({ message: response });
			} catch (error) {
				if (error.code === 11000)
					return res.sendUserError('The user already exists');
				res.sendServerError(`Something went wrong. ${error}`);
			}
		});

		this.post(
			'/realtimeproducts',
			['ADMIN'],
			uploader.array('files'),
			async (req, res) => {
				try {
					const {
						title,
						description,
						code,
						price,
						status,
						stock,
						category,
						thumbnails,
					} = req.body;
					if (
						!title ||
						!description ||
						!code ||
						!price ||
						!status ||
						!stock ||
						!category
					) {
						return res.status(400).json({ error: 'Incomplete data' });
					}
					const newProduct = {
						title,
						description,
						code,
						price,
						status,
						stock,
						category,
					};
					newProduct.thumbnails = [];
					if (req.files) {
						req.files.map(file => newProduct.thumbnails.push(file.path));
					}
					await Products.create(newProduct);

					const products = await Products.find(req.query);

					global.io.emit('showProducts', products);
					res.render('realTimeProducts.handlebars', {});
				} catch (error) {
					if (error.code === 11000)
						return res.sendUserError('The user already exists');
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
					const { pid } = req.params;
					const {
						title,
						description,
						code,
						price,
						status,
						stock,
						category,
						thumbnails,
					} = req.body;
					if (
						!title ||
						!description ||
						!code ||
						!price ||
						!status ||
						!stock ||
						!category
					) {
						return res.status(400).json({ error: 'Incomplete data' });
					}
					const newDataProduct = {
						title,
						description,
						code,
						price,
						status,
						stock,
						category,
					};

					newDataProduct.thumbnails = [];
					if (req.files) {
						req.files.map(file => newDataProduct.thumbnails.push(file.path));
					}

					const result = await Products.updateOne(
						{ _id: pid },
						newDataProduct,
						{
							new: true,
						}
					);
					if (result.nModified === 0) {
						return res.status(404).json({ error: 'Products not found' });
					}

					const products = await Products.find(req.query);

					global.io.emit('showProducts', products);
					res.render('realTimeProducts.handlebars', {});
				} catch (error) {
					if (error.code === 11000)
						return res.sendUserError('The user already exists');
					res.sendServerError(`Something went wrong. ${error}`);
				}
			}
		);

		this.delete('/realtimeproducts/:pid', ['ADMIN'], async (req, res) => {
			try {
				const { pid } = req.params;
				const result = await Products.deleteOne({ _id: pid });
				if (result.deletedCount === 0) {
					return res.status(404).json({ error: 'Products not found' });
				}
				const products = await Products.find(req.query);

				global.io.emit('showProducts', products);
				res.render('realTimeProducts.handlebars', {});
			} catch (error) {
				if (error.code === 11000)
					return res.sendUserError('The user already exists');
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
