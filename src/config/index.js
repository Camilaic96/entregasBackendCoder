require('dotenv').config();

const config = {
	port: process.env.PORT || 8080,
	db: {
		databaseDb: process.env.DATABASE_DB || '',
		userDb: process.env.USER_DB || 'admin',
		passDb: process.env.PASS_DB || 'admin',
	},
	github: {
		clientID_github: process.env.CLIENT_ID_GITHUB,
		clientSecret_github: process.env.CLIENT_SECRET_GITHUB,
	},
	google: {
		clientID_google: process.env.CLIENT_ID_GOOGLE,
		clientSecret_google: process.env.CLIENT_SECRET_GOOGLE,
	},
	jwtToken: {
		secretKey: process.env.SECRET_KEY,
	},
};

module.exports = config;
