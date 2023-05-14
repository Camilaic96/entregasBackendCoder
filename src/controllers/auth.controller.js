const passport = require('passport');

const Route = require('../router/router');
const Users = require('../services/users.service');
const UserDTO = require('../DTOs/User.dto');

class AuthRouter extends Route {
	init() {
		this.post(
			'/',
			['PUBLIC'],
			passport.authenticate('login', {
				failureRedirect: '/api/auth/failLogin',
			}),
			async (req, res) => {
				try {
					req.session.user = new UserDTO(req.user);
					res.redirect('/api/products');
				} catch (error) {
					req.logger.error(error);
					res.sendServerError('Login failed');
				}
			}
		);

		this.get('/failLogin', ['PUBLIC'], (req, res) => {
			req.logger.error('Login failed');
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
				req.session.user = new UserDTO(req.user);
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
				req.session.user = new UserDTO(req.user);
				res.redirect('/api');
			}
		);

		this.get('/logout', ['USER', 'PREMIUM', 'ADMIN'], (req, res) => {
			req.session.destroy(error => {
				if (error) return res.json({ error });

				res.redirect('/api/login');
			});
		});

		this.patch('/forgotPassword', ['PUBLIC'], async (req, res) => {
			try {
				const newUser = await Users.updateOne(req.body);
				if (!newUser) {
					console.log('The password cannot be the same as the previous one');
					res.redirect('/forgotPassword');
				}
				req.session.user = new UserDTO(req.user);

				res.redirect('/api/products');
			} catch (error) {
				res.json({ error });
			}
		});
	}
}

const authRouter = new AuthRouter();
const authController = authRouter.getRouter();

module.exports = authController;
