const {
	viewsTemplateController,
	authController,
	productsController,
	cartsController,
	messagesController,
	usersController,
} = require('../controllers');

const router = app => {
	app.use('/api', viewsTemplateController);
	app.use('/api/users', usersController);
	app.use('/api/auth', authController);
	app.use('/api/products', productsController);
	app.use('/api/carts', cartsController);
	app.use('/api/messages', messagesController);
};

module.exports = router;
