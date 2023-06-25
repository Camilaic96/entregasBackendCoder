const passport = require('passport');

const Route = require('../../router/router');

const Users = require('../../services/users.service');
const UserDTO = require('../../DTOs/User.dto');

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
					if (!req.session.user) {
						req.session.user = req.user;
					}
					req.user.last_connection.login_date = Date.now();
					const user = await Users.updateOne(req.user._id, req.user);
					req.session.user = user;
					// res.sendSuccess(user);
					res.redirect('/api/products');
				} catch (error) {
					req.logger.error(error);
					res.sendServerError('Login failed');
				}
			}
		);

		this.get('/failLogin', ['PUBLIC'], (req, res) => {
			// req.logger.error('Login failed');
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
				if (!req.session.user) {
					req.session.user = req.user;
				}
				req.user.last_connection.login_date = Date.now();
				const user = await Users.updateOne(req.user._id, req.user);
				req.session.user = user;
				// res.sendSuccess(user);
				res.redirect('/api/products');
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
				if (!req.session.user) {
					req.session.user = req.user;
				}
				req.user.last_connection.login_date = Date.now();
				const user = await Users.updateOne(req.user._id, req.user);
				req.session.user = new UserDTO(user);
				// res.sendSuccess(user);
				res.redirect('/api/products');
			}
		);

		this.get('/logout', ['USER', 'PREMIUM', 'ADMIN'], async (req, res) => {
			const user = await Users.findOne({ _id: req.session.user._id });
			user.last_connection.logout_date = Date.now();
			await Users.updateOne(user._id, user);
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
