const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const Route = require('./router');
const UserDao = require('../dao/mongoManager/User.dao');
const { secretKey } = require('../config/');

const User = new UserDao();

class UserRouter extends Route {
	init() {
		this.post(
			'/',
			passport.authenticate('register', { failureRedirect: '/failRegister' }),
			async (req, res) => {
				try {
					console.log('Registered user');
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

		this.post('/user/login', async (req, res) => {
			try {
				const { email, password } = req.body;
				const data = await User.findOne(email);

				const match = await bcrypt.compare(password, data.password);
				if (!match) return res.sendUserError('Incorrect password');

				const token = jwt.sign({ email, role: data.role }, secretKey);

				res.sendSuccess({ token });
			} catch (error) {
				res.sendServerError(`Something went wrong. ${error}`);
			}
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
module.exports = UserRouter;
