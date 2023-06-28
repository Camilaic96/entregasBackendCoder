/* eslint-disable no-useless-catch */

const UserDTO = require('../DTOs/User.dto');
const { usersRepository } = require('../repositories');
const Users = usersRepository;

const CustomErrors = require('../utils/errors/Custom.errors');
const {
	generateDocumentationErrorInfo,
} = require('../utils/errors/info.errors');
const EnumErrors = require('../utils/errors/Enum.errors');
const { hashPassword } = require('../utils/bcrypt.utils');

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
		const { uid } = param;
		const user = await Users.findById({ _id: uid });
		return user;
	} catch (error) {
		throw error;
	}
};

const create = async user => {
	try {
		const newUserInfo = new UserDTO(user);
		newUserInfo.password = hashPassword(newUserInfo.password);
		const newUser = await Users.create(newUserInfo);
		return newUser;
	} catch (error) {
		throw error;
	}
};

const updateOne = async (param, body) => {
	try {
		const user = new UserDTO(body);
		await Users.updateOne({ _id: param }, user, {
			new: true,
		});
		const updateUser = await Users.findOne({ _id: param });
		return updateUser;
	} catch (error) {
		throw error;
	}
};

const findOneAndUpdate = async (param, body) => {
	try {
		const user = new UserDTO(body);
		await Users.updateOne({ _id: param }, user);
		const updateUser = await Users.findById({ _id: param });
		return updateUser;
	} catch (error) {
		throw error;
	}
};

const updatePremium = async params => {
	try {
		const { uid } = params;
		const user = await Users.findOne({ _id: uid });
		const requiredDocuments = [
			'Identificación',
			'Comprobante de domicilio',
			'Comprobante de estado de cuenta',
		];
		const hasAllDocuments = requiredDocuments.every(document =>
			user.documents.some(doc => doc.name === document)
		);
		if (!hasAllDocuments) {
			CustomErrors.createError({
				name: 'Incomplete documentation',
				cause: generateDocumentationErrorInfo(),
				message:
					'Error trying to modify the role of user due to lack of documentation',
				code: EnumErrors.INCOMPLETE_DATA,
			});
		}
		user.role = 'PREMIUM';
		const newUserInfo = new UserDTO(user);
		const updateUser = await Users.findOneAndUpdate({ _id: uid }, newUserInfo, {
			new: true,
		});
		return updateUser;
	} catch (error) {
		throw error;
	}
};

const updatePassword = async body => {
	try {
		const { email, password } = body;
		const user = await Users.findOne({ email });
		user.password = hashPassword(password);
		const newUser = new UserDTO(user);
		const updateUser = await Users.findOneAndUpdate(
			{ _id: user._id },
			newUser,
			{
				new: true,
			}
		);
		return updateUser;
	} catch (error) {
		throw error;
	}
};

const updateDocuments = async (params, documents) => {
	try {
		const { uid } = params;
		const user = await Users.findOne({ _id: uid });
		if (user.role === 'PREMIUM') {
			return 'You are already a premium user';
		}
		documents.forEach(document => {
			const existingDocument = user.documents.find(
				doc => doc.name === document.name
			);

			if (existingDocument) {
				existingDocument.reference = document.reference;
			} else {
				user.documents.push(document);
			}
		});
		const updateUser = await Users.findOneAndUpdate({ _id: uid }, user, {
			new: true,
		});
		return updateUser;
	} catch (error) {
		throw error;
	}
};

const deleteOne = async params => {
	try {
		const { _id } = params;
		const deleteUser = await Users.deleteOne(_id);
		return deleteUser;
	} catch (error) {
		throw error;
	}
};

const deleteMany = async () => {
	try {
		const deleteUsers = await Users.deleteMany();
		return deleteUsers;
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
	findOneAndUpdate,
	updatePremium,
	updatePassword,
	updateDocuments,
	deleteOne,
	deleteMany,
};
