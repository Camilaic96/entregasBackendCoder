const bcrypt = require('bcrypt');

const hashPassword = password => {
	const salt = bcrypt.genSaltSync(10);
	const passwordHashed = bcrypt.hashSync(password, salt);

	return passwordHashed;
};

const comparePassword = (password, user) => {
	const isValid = bcrypt.compareSync(password, user.password);

	return isValid;
};

module.exports = {
	hashPassword,
	comparePassword,
};
