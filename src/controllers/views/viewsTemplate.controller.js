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
			if (req.session.user) {
				res.redirect('/api/products');
			}
			res.render('login.handlebars', { style: 'login.css' });
		});

		this.get('/signup', ['PUBLIC'], (req, res) => {
			if (req.session.user) {
				res.redirect('/api/products');
			}
			res.render('signup.handlebars', { style: 'signup.css' });
		});

		this.get('/resetPassword', ['PUBLIC'], (req, res) => {
			if (req.session.user) {
				res.redirect('/api/products');
			}
			const { emailSent } = req.session;
			res.render('resetPassword.handlebars', {
				emailSent,
				style: 'forgotPass.css',
			});
		});

		this.get('/forgotPassword/:uid', ['PUBLIC'], async (req, res) => {
			if (req.session.user) {
				res.redirect('/api/products');
			}
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

		this.get('/premium', ['ADMIN'], (req, res) => {
			const { user } = req.session;
			const isPremium = user.role === 'PREMIUM';
			res.render('premium.handlebars', {
				user,
				isPremium,
				style: 'premium.css',
			});
		});

		this.get('/purchase', ['USER', 'PREMIUM', 'ADMIN'], (req, res) => {
			res.render('purchase.handlebars', { style: 'purchase.css' });
		});
	}
}

const viewRouter = new ViewRouter();
const viewsController = viewRouter.getRouter();

module.exports = viewsController;
