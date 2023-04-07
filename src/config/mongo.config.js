const mongoose = require('mongoose');

const { db } = require('./');
const { userDb, passDb, databaseDb } = db;

mongoose.set('strictQuery', false);
mongoose
	.connect(
		`mongodb+srv://${userDb}:${passDb}@coderbackend.0lx0bci.mongodb.net/${databaseDb}?retryWrites=true&w=majority`
	)
	.then(() => console.log('Successfull connections to db'))
	.catch(error => console.log(`Something went wrong ${error}`));
