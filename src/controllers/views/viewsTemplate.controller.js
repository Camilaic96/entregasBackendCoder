const Route = require('../../router/router');

class ViewRouter extends Route {
	init() {
		this.get('/', ['PUBLIC'], (req, res) => {
			res.render('home.handlebars', { style: 'home.css' });
		});

		this.get(
			'/profile',
			/* ['USER', 'PREMIUM', 'ADMIN'] */ ['PUBLIC'],
			(req, res) => {
				const { user } = req.session;
				res.render('profile.handlebars', { user, style: 'profile.css' });
			}
		);

		this.get('/login', ['PUBLIC'], (req, res) => {
			res.render('login.handlebars', { style: 'login.css' });
		});

		this.get('/signup', ['PUBLIC'], (req, res) => {
			res.render('signup.handlebars', { style: 'signup.css' });
		});

		this.get('/forgotPassword', ['PUBLIC'], (req, res) => {
			console.log(req.session.validLink);
			if (!req.session.validLink) {
				const validLink = false;
				res.render('forgotPassword.handlebars', {
					validLink,
					style: 'forgotPass.css',
				});
			}
			const validLink = true;
			res.render('forgotPassword.handlebars', {
				validLink,
				style: 'forgotPass.css',
			});
		});

		this.get('/resetPassword', ['PUBLIC'], (req, res) => {
			const emailSent = req.session.emailSent;
			req.session.validLink = true;
			res.render('resetPassword.handlebars', {
				emailSent,
				style: 'forgotPass.css',
			});
		});

		// AGREGAR VISTA modificación y eliminación de usuario
		this.get('/premium', ['PUBLIC'] /* ['ADMIN'] */, (req, res) => {
			res.render('premium.handlebars', { style: 'premium.css' });
		});
	}
}

const viewRouter = new ViewRouter();
const viewsController = viewRouter.getRouter();

module.exports = viewsController;
