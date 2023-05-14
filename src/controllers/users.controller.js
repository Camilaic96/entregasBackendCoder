const passport = require('passport');

const Users = require('../services/users.service');
const UserDTO = require('../DTOs/User.dto');
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
					req.session.user = new UserDTO(req.user);
					res.redirect('/api/products');
				} catch (error) {
					if (error.code === 11000)
						return res.sendUserError('The user already exists');
					res.sendServerError(`Something went wrong. ${error}`);
				}
			}
		);

		this.get('/failRegister', ['PUBLIC'], (req, res) => {
			req.logger.error('Registration failed');
			res.sendServerError('Registration failed');
		});

		this.put('/premium/:uid', ['PUBLIC'], async (req, res) => {
			try {
				await Users.updateOne(req.params, req.body);
				res.sendSuccess('updated role');
			} catch (error) {
				res.sendServerError(`Something went wrong. ${error}`);
			}
		});
	}
}

const userRouter = new UserRouter();
const usersController = userRouter.getRouter();

module.exports = usersController;
