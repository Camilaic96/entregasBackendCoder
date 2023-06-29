const twilio = require('twilio');
const Route = require('../../router/router');
const { sms } = require('../../config');

const { SMS_ACCOUNT_SID, SMS_AUTH_TOKEN, SMS_PHONE_NUMBER } = sms;
const client = twilio(SMS_ACCOUNT_SID, SMS_AUTH_TOKEN);

class SmsRouter extends Route {
	init() {
		this.post('/', ['PUBLIC'], async (req, res) => {
			try {
				const { to, message } = req.body;
				const smsOptions = {
					from: SMS_PHONE_NUMBER,
					to,
					body: message,
				};
				const result = await client.messages.create(smsOptions);
				res.json({ message: result });
			} catch (error) {
				res.sendServerError(`Login failed. Error: ${error}`);
			}
		});
	}
}

const smsRouter = new SmsRouter();
const smsController = smsRouter.getRouter();

module.exports = smsController;
