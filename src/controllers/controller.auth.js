const passport = require('passport');

const Route = require('../router/router');
const User = require('../services/users.service');

class AuthRouter extends Route {
	init() {
		this.post(
			'/',
			passport.authenticate('login', { failureRedirect: 'failLogin' }),
			async (req, res) => {
				try {
					req.session.user = {
						first_name: req.user.first_name,
						last_name: req.user.last_name,
						age: req.user.age,
						email: req.user.email,
					};

					res.redirect('/api/products');
				} catch (error) {
					console.log(error);
					res.sendServerError('Login failed');
				}
			}
		);

		this.get('/failLogin', ['PUBLIC'], (req, res) => {
			console.log('Login failed');
			res.sendServerError('Login failed');
		});

		this.get(
			'/github',
			['PUBLIC'],
			passport.authenticate('github', { scope: ['user:email'] }),
			async (req, res) => {}
		);

		this.get(
			'/githubcallback',
			['PUBLIC'],
			passport.authenticate('github', { failureRedirect: '/login' }),
			async (req, res) => {
				req.session.user = req.user;
				res.redirect('/api');
			}
		);

		this.get(
			'/google',
			['PUBLIC'],
			passport.authenticate('google', { scope: ['profile'] }),
			async (req, res) => {}
		);

		this.get(
			'/google/callback',
			['PUBLIC'],
			passport.authenticate('google', { failureRedirect: '/login' }),
			async (req, res) => {
				req.session.user = req.user;
				res.redirect('/api');
			}
		);

		this.get('/logout', ['PUBLIC'], (req, res) => {
			req.session.destroy(error => {
				if (error) return res.json({ error });

				res.redirect('/api/login');
			});
		});

		this.patch('/forgotPassword', async (req, res) => {
			try {
				await User.updateUser(req.body);
				req.session.user = {
					first_name: req.user.first_name,
					last_name: req.user.last_name,
					age: req.user.age,
					email: req.user.email,
				};

				res.redirect('/api/products');
			} catch (error) {
				res.json({ error });
			}
		});
	}
}

const authRouter = new AuthRouter();
const authsController = authRouter.getRouter();

module.exports = authsController;
