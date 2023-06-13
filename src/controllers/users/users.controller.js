const passport = require('passport');

const uploader = require('../../utils/multer.js');
const Users = require('../../services/users.service.js');
const UserDTO = require('../../DTOs/User.dto.js');
const Route = require('../../router/router.js');

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
					// res.redirect('/api/products');
					res.sendSuccessCreated(req.session.user);
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

		this.put('/premium/:uid', ['PUBLIC'] /* ['USER'] */, async (req, res) => {
			try {
				const userPremium = await Users.updatePremium(req.params);
				res.sendSuccess(userPremium);
			} catch (error) {
				res.sendServerError(`Something went wrong. ${error}`);
			}
		});

		this.post(
			'/:uid/documents',
			['PUBLIC'],
			uploader.array('documents'),
			async (req, res) => {
				try {
					const user = await Users.updateOneDocuments(
						req.params,
						req.documents
					);
					res.sendSuccess(user);

					const files = req.files;

					res.sendSuccess(
						`Tus archivos ${files[0].filename} se cargaron correctamente`
					);
				} catch (error) {
					res.sendServerError(`Something went wrong. ${error}`);
				}
			}
		);
	}
}

const userRouter = new UserRouter();
const usersController = userRouter.getRouter();

module.exports = usersController;
