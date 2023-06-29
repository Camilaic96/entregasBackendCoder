const nodemailer = require('nodemailer');
const { email } = require('../config');
const { EMAIL_SERVICE, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = email;

class SendEmail {
	static transporter = nodemailer.createTransport({
		service: EMAIL_SERVICE,
		port: EMAIL_PORT,
		auth: {
			user: EMAIL_USER,
			pass: EMAIL_PASS,
		},
	});

	static sendEmail = (to, subject, message) => {
		const mailOptions = {
			from: EMAIL_USER,
			to,
			subject,
			html: `
				<div>
					<h1>${message}</h1>
				</div>
			`,
			attachments: [],
		};
		this.transporter.sendMail(mailOptions, (err, info) => {
			if (err) return console.log(err);
			console(`Sent email: ${info.response}`);
		});
	};
}

module.exports = SendEmail;
