/* eslint-disable camelcase */
const passport = require('passport');

const uploader = require('../../utils/multer.js');
const Users = require('../../services/users.service.js');
const UserDTO = require('../../DTOs/User.dto.js');
const SessionDTO = require('../../DTOs/Session.dto.js');
const Route = require('../../router/router.js');
const SendEmail = require('../../utils/email.utils.js');

class UserRouter extends Route {
	init() {
		this.get('/', ['ADMIN'], async (req, res) => {
			try {
				const users = await Users.find();
				const usersPrincipalData = users.map(user => ({
					user: new SessionDTO(user),
				}));
				res.render('panelAdmin.handlebars', {
					users: usersPrincipalData,
					style: 'purchase.css',
				});
				// res.sendSuccess(usersPrincipalData);
			} catch (error) {
				res.sendServerError(`Something went wrong. ${error}`);
			}
		});

		this.get('/:uid', ['ADMIN'], async (req, res) => {
			try {
				const user = await Users.findById(req.params);
				const { _id, first_name, last_name, email, role } = user;
				res.render('userId.handlebars', {
					_id,
					first_name,
					last_name,
					email,
					role,
					style: 'products.css',
				});
			} catch (error) {
				res.sendServerError(`Something went wrong. ${error}`);
			}
		});

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
					// res.sendSuccessCreated(req.session.user);
				} catch (error) {
					if (error.code === 11000)
						return res.sendUserError('The user already exists');
					res.sendServerError(`Something went wrong. ${error}`);
				}
			}
		);

		this.get('/failRegister', ['PUBLIC'], (req, res) => {
			// req.logger.error('Registration failed');
			res.sendServerError('Registration failed');
		});

		this.put('/premium/:uid', ['USER'], async (req, res) => {
			try {
				const user = await Users.updatePremium(req.params);
				req.session.user = user;
				res.redirect(302, '/api/premium');
			} catch (error) {
				res.sendServerError(`Something went wrong. ${error}`);
			}
		});

		this.post(
			'/:uid/documents',
			['USER', 'PREMIUM'],
			uploader.array('documents'),
			async (req, res) => {
				try {
					const user = await Users.updateOneDocuments(
						req.params,
						req.documents
					);
					res.sendSuccess(user);

					const files = req.documents;

					res.sendSuccess(
						`Tus archivos ${files[0].filename} se cargaron correctamente`
					);
				} catch (error) {
					res.sendServerError(`Something went wrong. ${error}`);
				}
			}
		);

		this.patch('/:uid', ['ADMIN'], async (req, res) => {
			try {
				const { uid } = req.params;
				const user = await Users.findById(req.params);
				const { userRole } = req.body;
				user.role = userRole || user.role;
				await Users.findOneAndUpdate(uid, user);
				res.redirect(302, '/api/users');
			} catch (error) {
				res.sendServerError(`Something went wrong. ${error}`);
			}
		});

		this.delete('/:uid', ['ADMIN'], async (req, res) => {
			try {
				await Users.deleteOne(req.params);
				res.redirect(302, '/api/users');
			} catch (error) {
				res.sendServerError(`Something went wrong. ${error}`);
			}
		});

		this.delete('/inactive', ['ADMIN'], async (req, res) => {
			try {
				const maxDaysOfInactivity = new Date();
				maxDaysOfInactivity.setDate(maxDaysOfInactivity.getDate() - 2);

				const users = await Users.find();
				const inactiveUsers = users.filter(user => {
					return user.last_connection.logout_date < maxDaysOfInactivity;
				});

				inactiveUsers.forEach(async user => {
					const { _id } = user;
					req.params = _id.toString();
					await Users.deleteOne(req.params);
					SendEmail.sendEmail(
						user.email,
						'Account deactivation due to inactivity',
						'Your account has been deactivated due to inactivity.'
					);
				});
				res.redirect(302, '/api/users');
			} catch (error) {
				res.sendServerError(`Something went wrong. ${error}`);
			}
		});
	}
}

const userRouter = new UserRouter();
const usersController = userRouter.getRouter();

module.exports = usersController;
