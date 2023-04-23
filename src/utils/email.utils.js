const nodemailer = require('nodemailer');
const { email } = require('../config');
const { emailService, emailPort, emailUser, emailPass } = email;

const transport = nodemailer.createTransport({
	service: emailService,
	port: emailPort,
	auth: {
		user: emailUser,
		pass: emailPass,
	},
});

module.exports = transport;
