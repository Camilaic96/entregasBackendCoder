const passport = require('passport');

const Route = require('../router/router');
const { generateToken } = require('../utils/jwt.utils');

class UserRouter extends Route {
	init() {
		this.post(
			'/',
			passport.authenticate('register', { failureRedirect: '/failRegister' }),
			async (req, res) => {
				try {
					req.session.user = {
						first_name: req.user.first_name,
						last_name: req.user.last_name,
						age: req.user.age,
						email: req.user.email,
					};

					const token = generateToken(req.session.user);

					console.log(token);

					res.redirect('/api/products');
				} catch (error) {
					if (error.code === 11000)
						return res.sendUserError('The user already exists');
					res.sendServerError(`Something went wrong. ${error}`);
				}
			}
		);

		this.get('/failRegister', (req, res) => {
			console.log('Registration failed');
			res.sendServerError('Registration failed');
		});

		this.get('/user/public', ['PUBLIC'], (req, res) => {
			res.sendSuccess('Respuesta exitosa. Ruta pública');
		});

		this.get('/user/privateUser', ['USER'], (req, res) => {
			res.sendSuccess(
				'Respuesta exitosa. Ruta a la que solo pueden acceder users'
			);
		});

		this.get('/user/privateAdmin', ['ADMIN'], (req, res) => {
			res.sendSuccess(
				'Respuesta exitosa. Ruta a la que solo pueden acceder admins'
			);
		});

		this.get('/', (req, res) => {
			res.sendSuccess('Respuesta exitosa');
		});
	}
}

const userRouter = new UserRouter();
const usersController = userRouter.getRouter();

module.exports = usersController;
