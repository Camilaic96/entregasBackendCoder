/* eslint-disable no-useless-catch */
// const { productsRepository } = require('../repositories');
// const Products = productsRepository;

const Products = require('../dao/mongo/mongoManager/Products.mongo');
const ProductDTO = require('../DTOs/Product.dto.js');
const CustomErrors = require('../utils/errors/Custom.errors');
const {
	generateProductErrorInfo,
	notFoundProductErrorInfo,
} = require('../utils/errors/info.errors');
const EnumErrors = require('../utils/errors/Enum.errors');
const SendEmail = require('../utils/email.utils.js');

const mapProducts = prod => {
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
			owner,
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
			owner,
		})
	);
	return products;
};

const find = async query => {
	try {
		console.log('llega a find en services');
		const limit = parseInt(query.limit) || 10;
		const page = parseInt(query.page) || 1;
		let sort = query.sort ? query.sort.toLowerCase() : '';
		sort = sort === 'asc' ? 1 : sort === 'desc' ? -1 : undefined;
		const optionsFind = {
			page,
			limit,
		};
		if (sort) {
			optionsFind.sort = { price: sort };
		}
		const category = query.category;
		const stock = query.stock;
		const filter = {
			...(category && { category }),
			...(stock && { stock: parseInt(stock) }),
		};
		console.log('antes de mandar en service');
		console.log(filter);
		console.log(optionsFind);
		const productsDB = await Products.find(filter, optionsFind);
		console.log(productsDB);
		const products = mapProducts(productsDB.docs);
		return products;
	} catch (error) {
		throw error;
	}
};

const findOne = async params => {
	try {
		const { pid } = params;
		const productDB = await Products.findOne({ _id: pid });
		if (!productDB._id) {
			CustomErrors.createError({
				name: 'Product not found in database',
				cause: notFoundProductErrorInfo(pid),
				message: 'Error trying to find product',
				code: EnumErrors.NOT_FOUND,
			});
		}
		const product = new ProductDTO(productDB);
		return product;
	} catch (error) {
		throw error;
	}
};

const insertMany = async newProducts => {
	try {
		const products = await Products.insertMany(newProducts);
		return products;
	} catch (error) {
		throw error;
	}
};

const create = async (body, files, user) => {
	try {
		const { title, description, code, price, status, stock, category } = body;
		if (
			!title ||
			!description ||
			!code ||
			!price ||
			!status ||
			!stock ||
			!category
		) {
			CustomErrors.createError({
				name: 'Product creation error',
				cause: generateProductErrorInfo({
					title,
					description,
					code,
					price,
					stock,
					category,
				}),
				message: 'Error trying to create product',
				code: EnumErrors.INVALID_TYPES_ERROR,
			});
		}
		const newProduct = {
			title,
			description,
			code,
			price,
			status,
			stock,
			category,
			owner: user.email || 'ADMIN',
		};
		newProduct.thumbnails = [];
		if (files) {
			files.map(file => newProduct.thumbnails.push(file.path));
		}
		const product = await Products.create(newProduct);
		return product;
	} catch (error) {
		throw error;
	}
};

const updateQuantity = async (param, newProduct) => {
	await updateOne(param, newProduct);
};

const updateOne = async (params, body, files, user) => {
	try {
		const { pid } = params;
		const product = await Products.findOne({ _id: pid });
		const { title, description, code, price, status, stock, category, owner } =
			body;
		if (user.role === 'PREMIUM' && user.email !== product.owner) {
			console.log(
				'You are not authorized to modify products that are not your own'
			);
			return 'You are not authorized to modify products that are not your own';
		}
		if (
			!title ||
			!description ||
			!code ||
			!price ||
			!status ||
			!stock ||
			!category ||
			!owner
		) {
			CustomErrors.createError({
				name: 'Product updating error',
				cause: generateProductErrorInfo({
					title,
					description,
					code,
					price,
					stock,
					category,
					owner,
				}),
				message: 'Error trying to update product',
				code: EnumErrors.INVALID_TYPES_ERROR,
			});
		}
		const newDataProduct = {
			title,
			description,
			code,
			price,
			status,
			stock,
			category,
			thumbnails: [],
			owner,
		};
		if (files) {
			files.map(file => newDataProduct.thumbnails.push(file.path));
		}

		const updateProduct = await Products.updateOne(
			{ _id: pid },
			newDataProduct,
			{
				new: true,
			}
		);
		if (updateProduct.nModified !== 0 && product.owner !== 'ADMIN') {
			SendEmail.sendEmail(
				product.owner,
				'Modification of a product in the database',
				`The product with ID ${pid}, authored by you, has been modified in the database.`
			);
		}
		if (updateProduct.nModified === 0) {
			CustomErrors.createError({
				name: 'Product not found in database',
				cause: notFoundProductErrorInfo(pid),
				message: 'Error trying to find product',
				code: EnumErrors.NOT_FOUND,
			});
		}
		return updateProduct;
	} catch (error) {
		throw error;
	}
};

const deleteOne = async (params, user) => {
	try {
		const { pid } = params;
		const product = await Products.findOne({ _id: pid });
		if (user.role === 'PREMIUM' && user.email !== product.owner) {
			console.log(
				'You are not authorized to remove products that are not your own'
			);
			return 'You are not authorized to remove products that are not your own';
		}

		const deleteProduct = await Products.deleteOne({ _id: pid });
		if (deleteProduct.deletedCount !== 0 && product.owner !== 'ADMIN') {
			SendEmail.sendEmail(
				product.owner,
				'Product removal from the database',
				`The product with ID ${pid}, authored by you, has been removed from the database.`
			);
		}
		if (deleteProduct.deletedCount === 0) {
			CustomErrors.createError({
				name: 'Product not found in database',
				cause: notFoundProductErrorInfo(pid),
				message: 'Error trying to find product',
				code: EnumErrors.NOT_FOUND,
			});
		}
		return deleteProduct;
	} catch (error) {
		throw error;
	}
};

const deleteMany = async () => {
	try {
		const deleteProducts = await Products.deleteMany();
		return deleteProducts;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	find,
	findOne,
	insertMany,
	create,
	updateOne,
	updateQuantity,
	deleteOne,
	deleteMany,
};
