const {
	viewsTemplateController,
	authController,
	productsController,
	cartsController,
	messagesController,
	usersController,
	emailsController,
	smsController,
	sessionController,
	mockingProductsController,
	loggerTestController,
} = require('../controllers');

const router = app => {
	app.use('/api', viewsTemplateController);
	app.use('/api/users', usersController);
	app.use('/api/auth', authController);
	app.use('/api/products', productsController);
	app.use('/api/carts', cartsController);
	app.use('/api/session', sessionController);
	app.use('/api/messages', messagesController);
	app.use('/api/emails', emailsController);
	app.use('/api/sms', smsController);
	app.use('/api/mockingproducts', mockingProductsController);
	app.use('/api/loggerTest', loggerTestController);
};

module.exports = router;
