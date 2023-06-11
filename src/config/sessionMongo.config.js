const MongoStore = require('connect-mongo');
const { db } = require('.');
const { dbHost, dbName, dbAdmin, dbPassword } = db;

const sessionMongo = {
	store: MongoStore.create({
		mongoUrl: `mongodb+srv://${dbAdmin}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority`,
		mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
		ttl: 3600,
	}),
	secret: 'Ecommerce',
	resave: false,
	saveUninitialized: false,
};

module.exports = sessionMongo;
