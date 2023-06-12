/* eslint-disable no-useless-catch */
/* eslint-disable camelcase */
const UserDTO = require('../DTOs/User.dto');
const { usersRepository } = require('../repositories');
const Users = usersRepository;
// const { comparePassword } = require('../utils/bcrypt.utils');
// const { hashPassword } = require('../utils/bcrypt.utils');

const CustomErrors = require('../utils/errors/Custom.errors');
const { notFoundProductErrorInfo } = require('../utils/errors/info.errors');
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
		// const { uid } = param;
		// console.log(uid);
		const user = new UserDTO(body);
		const updateUser = await Users.updateOne({ _id: param }, user, {
			new: true,
		});
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
			return 'faltan doc';
			/*
			En caso de llamar al endpoint, si no se ha terminado de cargar la documentación, devolver un error indicando que el usuario no ha terminado de procesar su documentación. (Sólo si quiere pasar de user a premium, no al revés)
			cambiar error por uno de faltan datos (documentos)
			CustomErrors.createError({
				name: 'Product not found in database',
				cause: notFoundProductErrorInfo(uid),
				message: 'Error trying to find product',
				code: EnumErrors.NOT_FOUND,
			});
			*/
		}
		user.role = 'PREMIUM';
		const newUserInfo = new UserDTO(user);
		const updateUser = await Users.updateOne({ _id: uid }, newUserInfo, {
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
		const user = await Users.findOne(uid);
		/* NO -> controlar que tenga cargado los siguientes documentos: Identificación, Comprobante de domicilio, Comprobante de estado de cuenta */
		if (user === 'a') {
			// cambiar error por uno de faltan datos (documentos)
			CustomErrors.createError({
				name: 'Product not found in database',
				cause: notFoundProductErrorInfo(uid),
				message: 'Error trying to find product',
				code: EnumErrors.NOT_FOUND,
			});
		}
		user.documents = 'PREMIUM';
		const newUserInfo = new UserDTO(user);
		const updateUser = await Users.updateOne({ _id: uid }, newUserInfo, {
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
	updatePremium,
	updateDocuments,
};
