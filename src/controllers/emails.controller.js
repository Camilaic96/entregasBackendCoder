const Route = require('../router/router');
const transport = require('../utils/email.utils');
const { email } = require('../config');
const { emailUser } = email;
// const Emails = require('../services/emails.service');

class EmailRouter extends Route {
	init() {
		this.post('/', ['PUBLIC'], async (req, res) => {
			try {
				const { to, subject, message } = req.body;
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
				const result = await transport.sendMail(mailOptions);
				res.json({ message: result });
			} catch (error) {
				console.log(error);
				res.sendServerError('Login failed');
			}
		});
		/*
		this.post('/', async (req, res) => {
			try {
			} catch (error) {
				console.log(error);
				res.sendServerError('Login failed');
			}
		});

		this.patch('/', ['PUBLIC'], async (req, res) => {
			try {
			} catch (error) {
				res.json({ error });
			}
		}); */
	}
}

const emailRouter = new EmailRouter();
const emailsController = emailRouter.getRouter();

module.exports = emailsController;
