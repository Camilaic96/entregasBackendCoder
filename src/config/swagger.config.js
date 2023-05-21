const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUiExpress = require('swagger-ui-express');

const swaggerOptions = {
	definition: {
		openapi: '3.0.1',
		info: {
			title: 'Documentación ecommerce coder',
			description: 'La documentación de los endpoints',
		},
	},
	apis: [`${process.cwd()}/src/docs/**/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);

const swaggerUiExpressServe = swaggerUiExpress.serve;
const swaggerUiExpressSetup = swaggerUiExpress.setup(specs);

module.exports = { swaggerUiExpressServe, swaggerUiExpressSetup };
