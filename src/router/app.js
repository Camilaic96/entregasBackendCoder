const productsController = require('../products/controller.products')
const cartsController = require('../carts/controller.carts');
const messagesController = require('../messages/controller.messages');

const router = (app) => {
    app.use('/api/products', productsController);
    app.use('/api/carts', cartsController);
    app.use('/api/messages', messagesController);
};

module.exports = router;