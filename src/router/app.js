const productsController = require('../products/controller.products')
const cartsController = require('../carts/controller.carts');
const chatsController = require('../chats/controller.chats');

const router = (app) => {
    app.use('/api/products', productsController);
    app.use('/api/carts', cartsController);
    app.use('/api/chats', chatsController);
};

module.exports = router;