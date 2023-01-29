const { Router } = require('express');
const CartManager = require('./class/CartManager.js');
const ProductManager = require('../products/class/ProductManager.js');

const router = Router();

const manejadorDeCarritos = new CartManager('./src/carts/cartsList.json');
const manejadorDeProductos = new ProductManager('./src/products/productsList.json');

router.post('/', async (req, res) => {
    const { products} = req.body;
    if (!products) {
        return res.status(400).json( {error: 'Faltan datos' });
    }
    for (let i = 0; i < products.length; i++) {
        if (!(await manejadorDeProductos.getProductById(Number(products[i].pid)))){
            return res.status(400).json( {error: 'Productos inválidos' });
        }
    }
    manejadorDeCarritos.addCart(products);
    res.status(200).json({ message: 'Carrito creado'});
})

router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    cartById = await manejadorDeCarritos.getCartById(Number(cid))
    if (!cartById) {
        return res.status(400).json( {error: 'No existe el carrito' });
    }
    res.json({ message: cartById });
})

router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity} = req.body;
    if(!quantity || (Number(quantity) < 1) || !(await manejadorDeCarritos.getCartById(Number(cid))) || !(await manejadorDeProductos.getProductById(Number(pid)))) {
        return res.status(400).json( {error: 'Datos inválidos' });
    }

    await manejadorDeCarritos.addProductToCart(Number(cid), Number(pid), Number(quantity));
    res.status(200).json({ message: 'Producto agregado correctamente'});
})

module.exports = router;