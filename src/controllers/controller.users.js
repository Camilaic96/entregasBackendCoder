const passport = require('passport');

const Route = require('../router/router');

class UserRouter extends Route {
	init() {
		this.post(
			'/',
			['PUBLIC'],
			passport.authenticate('register', {
				failureRedirect: '/api/user/failRegister',
			}),
			async (req, res) => {
				try {
					req.session.user = {
						first_name: req.user.first_name,
						last_name: req.user.last_name,
						age: req.user.age,
						email: req.user.email,
						role: req.user.role,
					};

					res.redirect('/api/products');
				} catch (error) {
					if (error.code === 11000)
						return res.sendUserError('The user already exists');
					res.sendServerError(`Something went wrong. ${error}`);
				}
			}
		);

		this.get('/failRegister', ['PUBLIC'], (req, res) => {
			console.log('Registration failed');
			res.sendServerError('Registration failed');
		});
	}
}

const userRouter = new UserRouter();
const usersController = userRouter.getRouter();

module.exports = usersController;
