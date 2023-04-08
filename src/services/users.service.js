/* eslint-disable camelcase */
const { hashPassword } = require('../utils/bcrypt.utils');
const store = require('../store/users.store');

const findUsers = async () => {
	try {
		const users = await store.findUsers();
		return users;
	} catch (error) {
		console.log(error);
	}
};

const findUser = async param => {
	try {
		const user = await store.findUser(param);
		return user;
	} catch (error) {
		console.log(error);
	}
};

const findUserById = async param => {
	try {
		const user = await store.findUserById(param);
		return user;
	} catch (error) {
		console.log(error);
	}
};

const createUser = async user => {
	try {
		const { first_name, last_name, age, email, password, role, carts } = user;

		const newUserInfo = {
			first_name,
			last_name,
			age,
			email,
			password: hashPassword(password),
			role,
			carts,
		};

		const newUser = await store.createUser(newUserInfo);

		return newUser;
	} catch (error) {
		console.log(error);
	}
};

const updateUser = async (user, newUserInfo) => {
	try {
		const updateUser = await store.updateOne(user, newUserInfo);
		return updateUser;
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	createUser,
	findUser,
	findUsers,
	updateUser,
	findUserById,
};
