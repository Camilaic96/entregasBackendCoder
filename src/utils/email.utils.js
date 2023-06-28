const nodemailer = require('nodemailer');
const { email } = require('../config');
const { emailService, emailPort, emailUser, emailPass } = email;

/*
const transport = nodemailer.createTransport({
	service: emailService,
	port: emailPort,
	auth: {
		user: emailUser,
		pass: emailPass,
	},
});

module.exports = transport;
*/

class SendEmail {
	static transporter = nodemailer.createTransport({
		service: emailService,
		port: emailPort,
		auth: {
			user: emailUser,
			pass: emailPass,
		},
	});

	static sendEmail = (to, subject, message) => {
		const mailOptions = {
			from: emailUser,
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
