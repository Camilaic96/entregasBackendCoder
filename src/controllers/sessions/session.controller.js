const Route = require('../../router/router');
const SessionDTO = require('../../DTOs/Session.dto');

class SessionRouter extends Route {
	init() {
		this.get('/current', ['PUBLIC'], async (req, res) => {
			try {
				const user = new SessionDTO(req.session.user);
				res.sendSuccess(user);
			} catch (error) {
				console.log(error);
				res.sendServerError(`Something went wrong. ${error}`);
			}
		});
	}
}

const sessionRouter = new SessionRouter();
const sessionsController = sessionRouter.getRouter();

module.exports = sessionsController;
