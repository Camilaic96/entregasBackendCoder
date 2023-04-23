const Message = require('../models/Messages.model');

class MessageDao {
	constructor(file) {
		this.file = `${process.cwd()}/src/files/${file}`;
	}

	async find() {
		try {
			const messages = await Message.find();
			return messages;
		} catch (error) {
			return error;
		}
	}

	async insertMany(newMessages) {
		try {
			const messages = await Message.insertMany(newMessages);
			return messages;
		} catch (error) {
			return error;
		}
	}

	async create(newMessage) {
		try {
			await Message.create(newMessage);
			return 'Message created';
		} catch (error) {
			return error;
		}
	}

	async deleteMany() {
		try {
			await Message.deleteMany();
			return 'Messages deleted';
		} catch (error) {
			return error;
		}
	}
}

module.exports = MessageDao;
