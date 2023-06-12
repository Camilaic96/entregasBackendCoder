const generateUserErrorInfo = user => {
	return `
        One or more properties were incomplete or not validate.
        List of required properties:
        * first_name : Needs to be a string, received ${user.first_name}
        * last_name  : Needs to be a string, received ${user.last_name}
        * email      : Needs to be a string, received ${user.email}
    `;
};

const generateDocumentationErrorInfo = () => {
	return `
        One or more required documents were not uploaded.
        List of required documents:
        * Identificación
        * Comprobante de domicilio
        * Comprobante de estado de cuenta `;
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

const notFoundProductErrorInfo = id => {
	return `
    The product with id ${id} was not found.`;
};

const notFoundCartErrorInfo = id => {
	return `
    The cart with id ${id} was not found.`;
};

module.exports = {
	generateUserErrorInfo,
	generateProductErrorInfo,
	notFoundProductErrorInfo,
	notFoundCartErrorInfo,
	generateDocumentationErrorInfo,
};
