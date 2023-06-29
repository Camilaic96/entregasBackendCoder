const twilio = require('twilio');
const Route = require('../../router/router');
const { sms } = require('../../config');

const { smsAccountSID, smsAuthToken, smsPhoneNumber } = sms;
console.log(sms);
const client = twilio(smsAccountSID, smsAuthToken);

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
				res.sendServerError(`Login failed. Error: ${error}`);
			}
		});
	}
}

const smsRouter = new SmsRouter();
const smsController = smsRouter.getRouter();

module.exports = smsController;
