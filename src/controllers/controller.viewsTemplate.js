const Route = require('../router/router');

class ViewRouter extends Route {
	init() {
		this.get('/', ['PUBLIC'], (req, res) => {
			const { user } = req.session;
			res.render('profile.handlebars', { user, style: 'profile.css' });
		});

		this.get('/login', ['PUBLIC'], (req, res) => {
			res.render('login.handlebars', { style: 'login.css' });
		});

		this.get('/signup', ['PUBLIC'], (req, res) => {
			res.render('signup.handlebars', { style: 'signup.css' });
		});

		this.get('/forgotPassword', ['PUBLIC'], (req, res) => {
			res.render('forgotPassword.handlebars', { style: 'forgotPass.css' });
		});
	}
}

const viewRouter = new ViewRouter();
const viewsController = viewRouter.getRouter();

module.exports = viewsController;
