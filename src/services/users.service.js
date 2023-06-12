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
/* ARREGLAR */
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

/* ARREGLAR */
// permita subir uno o múltiples archivos. Utilizar el middleware de Multer para poder recibir los documentos que se carguen y actualizar en el usuario su status para hacer saber que ya subió algún documento en particular.
const updateDocuments = async (params, body, documents) => {
	try {
		const { uid } = params;
		await Users.findOne({ _id: uid });
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
	updatePremium,
	updateDocuments,
};
