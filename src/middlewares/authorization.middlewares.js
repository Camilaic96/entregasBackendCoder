const authorization = role => {
	return async (req, res, next) => {
		if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
		const { user } = req.user;
		if (user.role !== role) {
			return res.status(403).json({ error: 'Forbiden' });
		}

		next();
	};
};

module.exports = authorization;
