const mongoose = require('mongoose');

const { db } = require('../src/config');
const { mongoUrl } = db;

class MongoConnect {
	static #instance;

	constructor() {
		this.mongoConnect();
	}

	async mongoConnect() {
		try {
			mongoose.set('strictQuery', false);
			await mongoose.connect(mongoUrl);
			console.log('Successful connections to db');
		} catch (error) {
			console.log(`Something went wrong. ${error}`);
		}
	}

	static getInstance() {
		if (!this.#instance) {
			this.#instance = new MongoConnect();
			return this.#instance;
		}
		return this.#instance;
	}
}

module.exports = MongoConnect;
