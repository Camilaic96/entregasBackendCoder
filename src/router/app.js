const productsController = require('../controllers/controller.products')
const cartsController = require('../controllers/controller.carts');
const messagesController = require('../controllers/controller.messages');

const router = (app) => {
    app.use('/api/products', productsController);
    app.use('/api/carts', cartsController);
    app.use('/api/messages', messagesController);
};

module.exports = router;