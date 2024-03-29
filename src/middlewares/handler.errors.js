const EnumErrors = require('../utils/errors/Enum.errors');

module.exports = (error, req, res, next) => {
	req.logger.error(error.cause);
	switch (error.code) {
		case EnumErrors.INVALID_TYPES_ERROR:
			res.json({ status: 'error', error: error.name });
			break;

		default:
			res.json({ status: 'error', error: 'Unhandled error' });
			break;
	}
};
