/* eslint-disable no-unused-vars */
const uploader = require('../utils/multer.js');
const Route = require('../router/router.js');

const Product = require('../services/products.service.js');

// const ProductDao = require('../dao/mongo/mongoManager/Product.dao.js');
// const Product = new ProductDao('Products.json');
const FilesDao = require('../dao/memory/Files.dao.js');
const FilesManager = new FilesDao('Products.json');

class ProductRouter extends Route {
	init() {
		this.get('/', ['PUBLIC'], async (req, res) => {
			try {
				const { user } = req.session;
				const limit = parseInt(req.query.limit) || 10;
				const page = parseInt(req.query.page) || 1;
				let sort = req.query.sort ? req.query.sort.toLowerCase() : '';
				sort = sort === 'asc' ? 1 : sort === 'desc' ? -1 : undefined;
				const optionsFind = {
					page,
					limit,
					sort: { price: sort },
				};
				const category = req.query.category;
				const stock = req.query.stock;
				const filter = {
					...(category && { category }),
					...(stock && { stock: parseInt(stock) }),
				};

				const productsBd = await Product.find(optionsFind, filter);
				const products = this.mapProducts(productsBd.docs);

				res.render('home.handlebars', { products, user, style: 'home.css' });
			} catch (error) {
				if (error.code === 11000)
					return res.sendUserError('The user already exists');
				res.sendServerError(`Something went wrong. ${error}`);
			}
		});

		this.get('/realtimeproducts', ['PUBLIC'], async (req, res) => {
			try {
				const limit = parseInt(req.query.limit) || 10;
				const page = parseInt(req.query.page) || 1;
				let sort = req.query.sort ? req.query.sort.toLowerCase() : '';
				sort = sort === 'asc' ? 1 : sort === 'desc' ? -1 : undefined;
				const optionsFind = {
					page,
					limit,
					sort: { price: sort },
				};
				const category = req.query.category;
				const stock = req.query.stock;
				const filter = {
					...(category && { category }),
					...(stock && { stock: parseInt(stock) }),
				};

				const productsBd = await Product.find(optionsFind, filter);
				const products = this.mapProducts(productsBd.docs);

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
				const product = await Product.findOne({ _id: pid });
				if (!product) {
					return res.status(400).json({ error: 'Product not found' });
				}
				const {
					_id,
					title,
					description,
					code,
					price,
					stock,
					category,
					status,
					thumbnails,
				} = product;
				res.render('productId.handlebars', {
					_id,
					title,
					description,
					code,
					price,
					stock,
					category,
					status,
					thumbnails,
					style: 'productId.css',
				});
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
				const response = await Product.insertMany(products);
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
				const response = await Product.create(newProduct);

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
					await Product.create(newProduct);

					const productsBd = await Product.find();
					const products = this.mapProducts(productsBd.docs);

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

					const result = await Product.updateOne({ _id: pid }, newDataProduct, {
						new: true,
					});
					if (result.nModified === 0) {
						return res.status(404).json({ error: 'Product not found' });
					}

					const productsBd = await Product.find();
					const products = this.mapProducts(productsBd.docs);

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
				const result = await Product.deleteOne({ _id: pid });
				if (result.deletedCount === 0) {
					return res.status(404).json({ error: 'Product not found' });
				}
				const productsBd = await Product.find();
				const products = this.mapProducts(productsBd.docs);

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
			await Product.deleteMany();
			res.json({ message: 'All products deleted' });
		});
	}

	mapProducts = prod => {
		const products = prod.map(
			({
				_id,
				title,
				description,
				code,
				price,
				stock,
				status,
				category,
				thumbnails,
			}) => ({
				id: _id,
				title,
				description,
				code,
				price,
				stock,
				status,
				category,
				thumbnails,
			})
		);
		return products;
	};
}

const productRouter = new ProductRouter();
const productsController = productRouter.getRouter();

module.exports = productsController;
