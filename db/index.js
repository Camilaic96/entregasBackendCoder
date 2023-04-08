const mongoose = require('mongoose');

const { db } = require('../src/config');
const { dbHost, dbName, dbAdmin, dbPassword } = db;

class MongoConnect {
	static #instance;

	constructor() {
		this.mongoConnect();
	}

	async mongoConnect() {
		try {
			mongoose.set('strictQuery', false);
			await mongoose.connect(
				`mongodb+srv://${dbAdmin}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority`
			);
			console.log('Successfull connections to db');
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
