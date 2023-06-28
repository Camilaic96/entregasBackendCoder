const Route = require('../../router/router');
const transport = require('../../utils/email.utils');
const { email } = require('../../config');
const { emailUser } = email;
const Users = require('../../services/users.service');
// const Emails = require('../services/emails.service');

class EmailRouter extends Route {
	init() {
		this.post('/', ['PUBLIC'], async (req, res) => {
			try {
				const { to, subject, message, urlRedirect } = req.body;
				// req.session.email = to;
				console.log(to);
				const user = await Users.findOne({ email: to });
				console.log(user);
				// req.session.emailSent = false;
				if (user) {
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
					await transport.sendMail(mailOptions);
					// req.session.emailSent = true;
					res.redirect(302, urlRedirect);
				} else {
					res.redirect(302, urlRedirect);
				}
			} catch (error) {
				// req.logger.error(error);
				res.sendServerError('Login failed');
			}
		});
	}
}

const emailRouter = new EmailRouter();
const emailsController = emailRouter.getRouter();

module.exports = emailsController;
