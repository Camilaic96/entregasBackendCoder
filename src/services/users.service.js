/* eslint-disable no-useless-catch */
/* eslint-disable camelcase */
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

const updateOne = async (params, body) => {
	try {
		const { uid } = params;
		const { email, password, role } = body;
		const data = uid ? { _id: uid } : { email };
		const user = await Users.findOne(data);
		user.password = password || user.password;
		user.role = role.toUpperCase() || user.role;
		const newUserInfo = new UserDTO(user);
		const updateUser = await Users.updateOne(data, newUserInfo, {
			new: true,
		});
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
