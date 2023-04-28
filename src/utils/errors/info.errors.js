const generateUserErrorInfo = user => {
	return `
        One or more properties were incomplete or not validate.
        List of required properties:
        * first_name : Needs to be a string, received ${user.first_name}
        * last_name  : Needs to be a string, received ${user.last_name}
        * email      : Needs to be a string, received ${user.email}
    `;
};

const generateProductErrorInfo = product => {
	return `
        One or more properties were incomplete or not validate.
        List of required properties:
        * title       : Needs to be a string, received ${product.title}
        * description : Needs to be a string, received ${product.description}
        * code        : Needs to be a string, received ${product.code}
        * price       : Needs to be a string, received ${product.price}
        * stock       : Needs to be a string, received ${product.stock}
        * category    : Needs to be a string, received ${product.category}
    `;
};

const notFoundProduct = id => {
	return `
    The product with id ${id} was not found in the database.`;
};

module.exports = {
	generateUserErrorInfo,
	generateProductErrorInfo,
	notFoundProduct,
};
