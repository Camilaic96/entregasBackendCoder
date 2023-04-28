/* eslint-disable no-useless-catch */
const { productsRepository } = require('../repositories');
const Products = productsRepository;

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
			sort: { price: sort },
		};
		const category = query.category;
		const stock = query.stock;
		const filter = {
			...(category && { category }),
			...(stock && { stock: parseInt(stock) }),
		};
		const productsBD = await Products.find(optionsFind, filter);
		const products = mapProducts(productsBD);
		return products;
	} catch (error) {
		throw error;
	}
};

const findOne = async param => {
	try {
		const product = await Products.findOne(param);
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

const create = async product => {
	try {
		const newProduct = await Products.create(product);
		return newProduct;
	} catch (error) {
		throw error;
	}
};

const updateOne = async (data, newData) => {
	try {
		const updateProduct = await Products.updateOne(data, newData);
		return updateProduct;
	} catch (error) {
		throw error;
	}
};

const deleteOne = async product => {
	try {
		const deleteProduct = await Products.deleteOne(product);
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
