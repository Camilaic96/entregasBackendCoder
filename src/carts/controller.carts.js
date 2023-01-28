const { Router } = require('express');
const CartManager = require('../class/CartManager.js');

const router = Router();

const manejadorDeCarritos = new CartManager('./src/cartsList.json');

router.post('/', async (req, res) => {
    const { products} = req.body;
    if (!products) {
        return res.status(400).json( {error: 'Faltan datos' });
    }
    manejadorDeCarritos.addCart(products);
    res.status(200).json({ message: 'Carrito creado'});
})

router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    cartById = await manejadorDeCarritos.getCartById(Number(cid))
    res.json({ message: cartById });
})

router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity} = req.body;
    if(!quantity || Number(quantity) < 1) {
        return res.status(400).json( {error: 'Cantidad inválida' });
    }
    await manejadorDeCarritos.addProductToCart(Number(cid), Number(pid), Number(quantity));
    res.status(200).json({ message: 'Producto agregado correctamente'});
})

module.exports = router;