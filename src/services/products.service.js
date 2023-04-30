/* eslint-disable no-useless-catch */
const { productsRepository } = require('../repositories');
const Products = productsRepository;
const ProductDTO = require('../DTOs/Product.dto.js');
const CustomErrors = require('../utils/errors/Custom.errors');
const {
	generateProductErrorInfo,
	notFoundProductErrorInfo,
} = require('../utils/errors/info.errors');
const EnumErrors = require('../utils/errors/Enum.errors');

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

const find = async query => {
	try {
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
		const productsDB = await Products.find(filter, optionsFind);
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

const create = async (body, files) => {
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

const updateOne = async (params, body, files) => {
	try {
		const { pid } = params;
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
				name: 'Product updating error',
				cause: generateProductErrorInfo({
					title,
					description,
					code,
					price,
					stock,
					category,
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

const deleteOne = async params => {
	try {
		const { pid } = params;
		const deleteProduct = await Products.deleteOne({ _id: pid });
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
	deleteOne,
	deleteMany,
};
