const bcrytp = require('bcrypt');

const createHash = password => {
    const salt = bcrytp.genSaltSync(10);
    const passwordHashed = bcrytp.hashSync(password, salt);

    return passwordHashed;
};

const isValidPasswordMethod = (password, user) => {
    const isValid = bcrytp.compareSync(password, user.password);

    return isValid;
};

module.exports = {
    createHash,
    isValidPasswordMethod
};