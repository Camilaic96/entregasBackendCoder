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
			// req.logger.error('Registration failed');
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
						req.body,
						req.documents
					);
					res.sendSuccess(user);
				} catch (error) {
					res.sendServerError(`Something went wrong. ${error}`);
				}
			}
		);
		/*
		updatePassword = async(email, newPassword) => {
        try {
            const response = await userModel.findOneAndUpdate({ email }, { password: newPassword })
            return response;
        } catch (error) {
            throw new Error(error)
        }
    }

    updateRole = async(email, newRole) => {
        try {
            const response = await userModel.findOneAndUpdate({ email }, { role: newRole })
            return response;
        } catch (error) {
            throw new Error(error)
        }
    }
    updateConnection = async(email, new_connection) => {
        try {
            const response = await userModel.findOneAndUpdate({ email }, { last_connection: new_connection })
            return response;
        } catch (error) {
            throw new Error(error)
        }
    }
		*/
	}
}

const userRouter = new UserRouter();
const usersController = userRouter.getRouter();

module.exports = usersController;
