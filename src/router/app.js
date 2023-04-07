const {
	viewsTemplateController,
	authController,
	productsController,
	cartsController,
	messagesController,
} = require('../controllers');
const UserRouter = require('./users.router');

const userRouter = new UserRouter();

const router = app => {
	app.use('/api', viewsTemplateController);
	app.use('/api/users', userRouter.getRouter());
	app.use('/api/auth', authController);
	app.use('/api/products', productsController);
	app.use('/api/carts', cartsController);
	app.use('/api/messages', messagesController);
};

module.exports = router;
