// agregar DTO para filtrar los datos que no deben ser mostrados
const Route = require('../router/router');
const SessionDTO = require('../DTOs/Session.dto');

class SessionRouter extends Route {
	init() {
		this.get('/current', ['PUBLIC'], (req, res) => {
			try {
				if (!req.session.user) return res.sendSuccess('User not logged in');
				const user = new SessionDTO(req.session.user);
				res.sendSuccess(user);
			} catch (error) {
				res.sendServerError(`Something went wrong. ${error}`);
			}
		});
	}
}

const sessionRouter = new SessionRouter();
const sessionsController = sessionRouter.getRouter();

module.exports = sessionsController;
