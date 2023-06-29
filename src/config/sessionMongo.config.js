const MongoStore = require('connect-mongo');
const { db } = require('.');
const { MONGO_URL } = db;

const sessionMongo = {
	store: MongoStore.create({
		mongoUrl: MONGO_URL,
		mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
		ttl: 3600,
	}),
	secret: 'Ecommerce',
	resave: false,
	saveUninitialized: false,
};

module.exports = sessionMongo;
