const Route = require('../../router/router');
const Users = require('../../services/users.service.js');

class ViewRouter extends Route {
	init() {
		this.get('/', ['PUBLIC'], (req, res) => {
			res.render('home.handlebars', { style: 'home.css' });
		});

		this.get('/profile', ['USER', 'PREMIUM', 'ADMIN'], (req, res) => {
			const { user } = req.session;
			res.render('profile.handlebars', {
				user,
				style: 'profile.css',
			});
		});

		this.get('/login', ['PUBLIC'], (req, res) => {
			res.render('login.handlebars', { style: 'login.css' });
		});

		this.get('/signup', ['PUBLIC'], (req, res) => {
			res.render('signup.handlebars', { style: 'signup.css' });
		});

		/*
		this.get('/forgotPassword', ['PUBLIC'], (req, res) => {
			const { email } = req.body;
			console.log(email, 'email body forgot');
			console.log(req.session.email, 'req.session.email en forgot');
			if (!req.session.validLink || email !== req.session.email) {
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
			if (!req.session.emailVerified) {
				res.render('resetPassword.handlebars', {
					style: 'forgotPass.css',
				});
			} else {
				const emailSent = req.session.emailSent;
				req.session.validLink = true;
				const emailVerified = req.session.emailVerified;
				console.log(req.session.email, 'req.session.email en reset');
				res.render('resetPassword.handlebars', {
					emailSent,
					emailVerified,
					style: 'forgotPass.css',
				});
			}
		});
		*/

		this.get('/resetPassword', ['PUBLIC'], (req, res) => {
			const { emailSent } = req.session;
			res.render('resetPassword.handlebars', {
				emailSent,
				style: 'forgotPass.css',
			});
		});

		this.get('/forgotPassword/:uid', ['PUBLIC'], async (req, res) => {
			if (req.session.emailSent) {
				const user = await Users.findById(req.params);
				const { email } = user;
				res.render('forgotPassword.handlebars', {
					user,
					email,
					style: 'forgotPass.css',
				});
			} else {
				res.render('forgotPassword.handlebars', {
					style: 'forgotPass.css',
				});
			}
		});

		this.get('/premium', ['PUBLIC'] /* ['ADMIN'] */, (req, res) => {
			const { user } = req.session;
			const isPremium = user.role === 'PREMIUM';
			res.render('premium.handlebars', {
				user,
				isPremium,
				style: 'premium.css',
			});
		});

		this.get(
			'/purchase',
			['PUBLIC'] /* ['USER', 'PREMIUM', 'ADMIN'] */,
			(req, res) => {
				res.render('purchase.handlebars', { style: 'purchase.css' });
			}
		);
	}
}

const viewRouter = new ViewRouter();
const viewsController = viewRouter.getRouter();

module.exports = viewsController;
