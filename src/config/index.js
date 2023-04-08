const dotenv = require('dotenv');
const { Command } = require('commander');

const command = new Command();

command.option('--mode <mode>', 'Environment').parse();

const { mode } = command.opts();

dotenv.config({
	path: `././.env.${mode}`,
});

const config = {
	port: process.env.PORT || 8080,
	db: {
		dbHost: process.env.DB_HOST,
		dbName: process.env.DB_NAME || '',
		dbAdmin: process.env.DB_ADMIN || 'admin',
		dbPassword: process.env.DB_PASSWORD || 'admin',
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
