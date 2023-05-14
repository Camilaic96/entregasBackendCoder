const mongoose = require('mongoose');

const userCollection = 'user';

const userSchema = new mongoose.Schema({
	googleId: {
		type: String,
		required: false,
	},
	first_name: {
		type: String,
		required: true,
		index: true,
	},
	last_name: String,
	email: {
		type: String,
		required: true,
		unique: true,
	},
	age: Number,
	password: {
		type: String,
		required: true,
	},
	carts: {
		type: [
			{
				cart: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'cart',
				},
			},
		],
		default: [],
	},
	role: {
		type: String,
		enum: ['user', 'admin', 'premium'],
		default: 'user',
	},
});

const User = mongoose.model(userCollection, userSchema);

module.exports = User;
