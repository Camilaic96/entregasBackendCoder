const bcrytp = require('bcrypt');

const hashPassword = password => {
	const salt = bcrytp.genSaltSync(10);
	const passwordHashed = bcrytp.hashSync(password, salt);

	return passwordHashed;
};

const comparePassword = (password, user) => {
	const isValid = bcrytp.compareSync(password, user.password);

	return isValid;
};

module.exports = {
	hashPassword,
	comparePassword,
};
