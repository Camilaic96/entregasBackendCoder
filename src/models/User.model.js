const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
		required: true,
	},
});

userSchema.pre('save', function (next) {
	bcrypt
		.hash(this.password, 10)
		.then(hash => {
			this.password = hash;
			next();
		})
		.catch(error => next(error));
});

const User = mongoose.model(userCollection, userSchema);

module.exports = User;
