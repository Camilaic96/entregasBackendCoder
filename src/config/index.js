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
	persistence: process.env.PERSISTENCE || 'memory',
	email: {
		emailService: process.env.EMAIL_SERVICE,
		emailPort: process.env.EMAIL_PORT,
		emailUser: process.env.EMAIL_USER,
		emailPass: process.env.EMAIL_PASS,
	},
	sms: {
		smsAccountSID: process.env.SMS_ACCOUNT_SID,
		smsAuthToken: process.env.SMS_AUTH_TOKEN,
		smsPhoneNumber: process.env.SMS_PHONE_NUMBER,
	},
};

module.exports = config;
