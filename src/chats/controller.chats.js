const { Router } = require('express');
const Chat = require('../dao/models/Chats.model')
//const ProductManager = require('../dao/ProductManager.js');

const router = Router();

//const manejadorDeCarritos = new CartManager('./src/files/Carts.json');

router.get('/', async (req, res) => {
    res.render('chat.handlebars', {})
})

module.exports = router;