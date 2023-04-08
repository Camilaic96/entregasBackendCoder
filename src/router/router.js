const { Router } = require('express');
const passport = require('passport');

class Route {
	constructor() {
		this.router = Router();
		this.init();
	}

	getRouter() {
		return this.router;
	}

	init() {}

	get(path, policies, ...callbacks) {
		this.router.get(
			path,
			this.handlePolicies(policies),
			this.generateCustomResponses,
			this.applyCallbacks(callbacks)
		);
	}

	post(path, ...callbacks) {
		this.router.post(
			path,
			this.generateCustomResponses,
			this.applyCallbacks(callbacks)
		);
	}

	put(path, ...callbacks) {
		this.router.put(
			path,
			this.generateCustomResponses,
			this.applyCallbacks(callbacks)
		);
	}

	patch(path, ...callbacks) {
		this.router.patch(
			path,
			this.generateCustomResponses,
			this.applyCallbacks(callbacks)
		);
	}

	delete(path, ...callbacks) {
		this.router.delete(
			path,
			this.generateCustomResponses,
			this.applyCallbacks(callbacks)
		);
	}

	applyCallbacks(callbacks) {
		return callbacks.map(callback => async (...params) => {
			try {
				await callback.apply(this, params);
			} catch (error) {
				console.log(error);
				params[1].status(500).send(error);
			}
		});
	}

	generateCustomResponses = (req, res, next) => {
		res.sendSuccess = payload => res.send({ status: 200, payload });
		res.sendServerError = error => res.send({ status: 500, error });
		res.sendUserError = error => res.send({ status: 400, error });
		next();
	};

	handlePolicies = policies => {
		if (policies[0] === 'PUBLIC') {
			return (req, res, next) => {
				next();
			};
		}
		return async (req, res, next) => {
			passport.authenticate('jwt', function (err, user, info) {
				if (err) return next(err);

				if (!user) {
					return res.status(401).send({
						error: info.messages
							? info.messages
							: 'Something went wrong during validation',
					});
				}
				if (user.role !== policies[0]) {
					return res.status(403).send({
						error:
							'Forbidden. You do not have sufficient permissions to access the path',
					});
				}

				req.user = user;
				next();
			})(req, res, next);
		};
	};
}

module.exports = Route;
