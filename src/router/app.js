const {
	viewsTemplateController,
	authController,
	productsController,
	cartsController,
	messagesController,
	usersController,
	emailsController,
	smsController,
} = require('../controllers');

const router = app => {
	app.use('/api', viewsTemplateController);
	app.use('/api/users', usersController);
	app.use('/api/auth', authController);
	app.use('/api/products', productsController);
	app.use('/api/carts', cartsController);
	app.use('/api/messages', messagesController);
	app.use('/api/emails', emailsController);
	app.use('/api/sms', smsController);
};

module.exports = router;
