const { Router } = require('express');
const Cart = require('../dao/models/Carts.model')
const Product = require('../dao/models/Products.model')
const CartManager = require('../dao/CartManager.js');
const ProductManager = require('../dao/ProductManager.js');

const router = Router();

const manejadorDeCarritos = new CartManager('./src/files/Carts.json');
const manejadorDeProductos = new ProductManager('./src/files/Products.json');

router.post('/', async (req, res) => {
    const { products } = req.body;
    /*
    if (!products) {
        return res.status(400).json({ error: 'Faltan datos' });
    }
    for (let i = 0; i < products.length; i++) {
        if (!(await manejadorDeProductos.getProductById(Number(products[i].pid)))) {
            return res.status(400).json({ error: 'Productos inválidos' });
        }
    }
    manejadorDeCarritos.addCart(products);
    res.status(200).json({ message: 'Carrito creado' });
    */
    try {
        for (let i = 0; i < products.length; i++) {
            if (!(await Cart.findOne({ id: Number(products[i].pid) }))) {
                return res.status(400).json({ error: 'Productos inválidos' });
            }
        }
        const response = await Cart.create(newCart)

        res.json({ message: response })
    } catch (error) {
        res.status(400).json({ error })
    }
})

router.get('/:cid', async (req, res) => {
    /*
    const { cid } = req.params;
    cartById = await manejadorDeCarritos.getCartById(Number(cid))
    if (!cartById) {
        return res.status(400).json({ error: 'No existe el carrito' });
    }
    res.json({ message: cartById });
    */
    try {
        const { cid } = req.params;
        const cartById = await Cart.findOne({ id: parseInt(cid) });
        if (!cartById) {
            return res.status(400).json({ error: 'No existe el carrito' });
        }
        res.status(200).json({ message: cartById });
    } catch (error) {
        res.status(400).json({ error });
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    /*
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    if (!quantity || (Number(quantity) < 1) || !(await manejadorDeCarritos.getCartById(Number(cid))) || !(await manejadorDeProductos.getProductById(Number(pid)))) {
        return res.status(400).json({ error: 'Datos inválidos' });
    }

    await manejadorDeCarritos.addProductToCart(Number(cid), Number(pid), Number(quantity));
    res.status(200).json({ message: 'Producto agregado correctamente' });
    */
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        if (!quantity || (Number(quantity) < 1) || !(await Cart.findOne({ id: parseInt(cid) })) || ! (await Product.findOne({ id: parseInt(pid) }))) {
            return res.status(400).json({ error: 'Datos inválidos' });
        }

    } catch (error) {
        res.status(400).json({ error });
    }
})

module.exports = router;