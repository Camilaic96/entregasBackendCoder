const viewsTemplateController = require('../controllers/controller.viewsTemplate');
const authController = require('../controllers/controller.auth')
const usersController = require('../controllers/controller.users')
const productsController = require('../controllers/controller.products')
const cartsController = require('../controllers/controller.carts');
const messagesController = require('../controllers/controller.messages');

const router = (app) => {
    app.use('/api', viewsTemplateController)
    app.use('/api/auth', authController)
    app.use('/api/users', usersController)
    app.use('/api/products', productsController);
    app.use('/api/carts', cartsController);
    app.use('/api/messages', messagesController);
};

module.exports = router;