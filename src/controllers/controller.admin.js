const { Router } = require('express');
const passport = require('passport');
const { passportCall } = require('../utils/passportCall.utils');
const authorization = require('../middlewares/authorization.middlewares');

const router = Router();

router.get(
	'/private',
	passportCall('jwt'),
	passport.authenticate('jwt', { session: false }),
	authorization('admin'),
	(req, res) => {
		res.json({ message: 'Si ves esto es porque eres admin' });
	}
);

module.exports = router;
