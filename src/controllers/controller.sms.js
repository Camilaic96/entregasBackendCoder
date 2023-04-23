const twilio = require('twilio');
const Route = require('../router/router');
const { sms } = require('../config');

const { smsAccountSID, smsAuthToken, smsPhoneNumber } = sms;
const client = twilio(smsAccountSID, smsAuthToken);
// const Emails = require('../services/emails.service');

class SmsRouter extends Route {
	init() {
		this.post('/', ['PUBLIC'], async (req, res) => {
			try {
				const { to, message } = req.body;
				const smsOptions = {
					from: smsPhoneNumber,
					to,
					body: message,
				};
				const result = await client.messages.create(smsOptions);
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

const smsRouter = new SmsRouter();
const smssController = smsRouter.getRouter();

module.exports = smssController;
