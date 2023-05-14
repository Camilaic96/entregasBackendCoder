const Route = require('../router/router');
const transport = require('../utils/email.utils');
const { email } = require('../config');
const { emailUser } = email;
const Users = require('../services/users.service');
// const Emails = require('../services/emails.service');

class EmailRouter extends Route {
	init() {
		this.post('/', ['PUBLIC'], async (req, res) => {
			try {
				const { to } = req.body;
				const user = await Users.findOne({ email: to });
				req.session.emailSent = false;
				if (user) {
					const mailOptions = {
						from: emailUser,
						to,
						subject: 'Reset password',
						html: `
							<div>
								<h1>Click <a href="http://localhost:8080/api/forgotPassword">here</a> to reset your password</h1>
							</div>
						`,
						attachments: [],
					};
					await transport.sendMail(mailOptions);
					req.session.emailSent = true;
					res.redirect('/api/resetPassword');
				} else {
					res.redirect('/api/resetPassword');
				}
			} catch (error) {
				req.logger.error(error);
				res.sendServerError('Login failed');
			}
		});
	}
}

const emailRouter = new EmailRouter();
const emailsController = emailRouter.getRouter();

module.exports = emailsController;
