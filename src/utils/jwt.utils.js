const jwt = require('jsonwebtoken');
const { jwtToken } = require('../config');
const { secretKey } = jwtToken;

exports.generateToken = user => {
	const token = jwt.sign({ user }, secretKey, { expiresIn: '60s' });

	return token;
};

exports.authToken = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) return res.status(401).json({ error: 'Not authenticaded' });

	const token = authHeader.split(' ')[1];

	jwt.verify(token, secretKey, (error, credentials) => {
		if (error) return res.status(403).json({ error: 'Not authorized' });

		req.user = credentials.user;
	});
};

exports.authTokenCookies = (req, res, next) => {
	const token = req.cookies.authToken;
	if (!token) return res.status(401).json({ error: 'Not authenticaded' });

	jwt.verify(token, secretKey, (error, credentials) => {
		if (error) return res.status(403).json({ error: 'Not authorized' });

		req.user = credentials.user;
	});
};
