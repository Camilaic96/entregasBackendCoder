const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productCollection = 'product';

const productSchema = new mongoose.Schema({
	title: String,
	description: String,
	code: String,
	price: Number,
	status: {
		type: Boolean,
		default: true,
	},
	stock: Number,
	category: String,
	thumbnail: {
		type: Array,
		default: [],
	},
	owner: {
		type: String,
		default: 'admin',
	},
});

productSchema.plugin(mongoosePaginate);
const Product = mongoose.model(productCollection, productSchema);

module.exports = Product;
