const dotenv = require('dotenv');
const { Command } = require('commander');

const command = new Command();

command.option('--mode <mode>', 'Environment').parse();

const { mode } = command.opts();

dotenv.config({
	path: `././.env.${mode}`,
});

const config = {
	mode,
	PORT: process.env.PORT || 8080,
	db: {
		MONGO_URL: process.env.MONGO_URL,
		dbHost: process.env.DB_HOST,
		dbName: process.env.DB_NAME || '',
		dbAdmin: process.env.DB_ADMIN || 'admin',
		dbPassword: process.env.DB_PASSWORD || 'admin',
	},
	github: {
		CLIENT_ID_GITHUB: process.env.CLIENT_ID_GITHUB,
		CLIENT_SECRET_GITHUB: process.env.CLIENT_SECRET_GITHUB,
		URL_GITHUB: process.env.URL_GITHUB,
	},
	google: {
		CLIENT_ID_GOOGLE: process.env.CLIENT_ID_GOOGLE,
		CLIENT_SECRET_GOOGLE: process.env.CLIENT_SECRET_GOOGLE,
		URL_GOOGLE: process.env.URL_GOOGLE,
	},
	jwtToken: {
		SECRET_KEY: process.env.SECRET_KEY,
	},
	persistence: process.env.PERSISTENCE || 'memory',
	email: {
		EMAIL_SERVICE: process.env.EMAIL_SERVICE,
		EMAIL_PORT: process.env.EMAIL_PORT,
		EMAIL_USER: process.env.EMAIL_USER,
		EMAIL_PASS: process.env.EMAIL_PASS,
	},
	sms: {
		SMS_ACCOUNT_SID: process.env.SMS_ACCOUNT_SID,
		SMS_AUTH_TOKEN: process.env.SMS_AUTH_TOKEN,
		SMS_PHONE_NUMBER: process.env.SMS_PHONE_NUMBER,
	},
};

module.exports = config;
