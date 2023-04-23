/* eslint-disable no-useless-catch */
/* eslint-disable camelcase */
const { hashPassword } = require('../utils/bcrypt.utils');
const UserDTO = require('../DTOs/User.dto');
const { usersRepository } = require('../repositories');
const Users = usersRepository;

const find = async () => {
	try {
		const users = await Users.find();

		return users;
	} catch (error) {
		throw error;
	}
};

const findOne = async param => {
	try {
		const user = await Users.findOne(param);

		return user;
	} catch (error) {
		throw error;
	}
};

const findById = async param => {
	try {
		const user = await Users.findById(param);
		return user;
	} catch (error) {
		throw error;
	}
};

const create = async user => {
	try {
		const newUserInfo = new UserDTO(user);

		const newUser = await Users.create(newUserInfo);

		return newUser;
	} catch (error) {
		throw error;
	}
};

const updateOne = async data => {
	try {
		const { email, password } = data;
		const passwordHashed = hashPassword(password);
		const updateUser = await Users.updateOne(
			{ email },
			{ password: passwordHashed }
		);
		return updateUser;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	find,
	findOne,
	findById,
	create,
	updateOne,
};
