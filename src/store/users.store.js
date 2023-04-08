const Users = require('../dao/mongoManager/User.dao');
const User = new Users();

const findUsers = async () => {
	try {
		const users = await User.find();
		return users;
	} catch (error) {
		console.log(error);
	}
};

const findUser = async param => {
	try {
		const user = await User.findOne(param);
		return user;
	} catch (error) {
		console.log(error);
	}
};

const findUserById = async param => {
	try {
		const user = await User.findById(param);
		return user;
	} catch (error) {
		console.log(error);
	}
};

const createUser = async newUserInfo => {
	try {
		const newUser = await User.create(newUserInfo);
		return newUser;
	} catch (error) {
		console.log(error);
	}
};

const updateUser = async (data, newData) => {
	try {
		const updateUser = await User.updateOne(data, newData);
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
