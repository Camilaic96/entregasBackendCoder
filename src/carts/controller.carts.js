const { Router } = require('express');

const CartDao = require('../dao/mongoManager/Cart.dao.js');
const Cart = new CartDao('Carts.json');
const ProductDao = require('../dao/mongoManager/Product.dao.js');
const Product = new ProductDao('Products.json');
const FilesDao = require('../dao/fsManager/Files.dao');
const CartManager = new FilesDao('Carts.json')

const router = Router();

router.get('/', async (req, res) => {
    try {
        const carts = await Cart.find()
        res.json( { response: carts })
    } catch (error) {
        res.status(500).json({ error })
    }
})

router.post('/populate', async (req, res) => {
    const carts = await CartManager.loadItems()
    const response = await Cart.insertMany(carts)
    res.json({ message: response })
})

router.post('/', async (req, res) => {
    try {
        const { products } = req.body;
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
    try {
        const { cid } = req.params;
        const cartById = await Cart.findOne({ id: parseInt(cid) });
        if (!cartById) {
            return res.status(400).json({ error: 'No existe el carrito' });
        }
        const products = cartById.products
        res.render('cartId.handlebars', { products })
    } catch (error) {
        res.status(400).json({ error });
    }
})

router.post('/:cid/products/:pid', async (req, res) => {
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

//Delete all carts bd
router.delete('/', async (req, res) => {
    await Cart.deleteMany()
    res.json({ message: 'Todos los carritos eliminados' })
})

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await Cart.findOne({ id: parseInt(cid) })
        newProducts = cart.products.filter(product => product.pid !== parseInt(pid))
        await Cart.updateOne(parseInt(cid), newProducts)
        res.json({ message: 'Producto eliminado'})
    } catch (error) {
        res.status(400).json({ error });
    }
})

router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        await Cart.deleteOne({ id: parseInt(cid) })
        res.json({ message: 'Carrito eliminado'})
    } catch (error) {
        res.status(400).json({ error });
    }
})

router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const { products } = req.body

        await Cart.updateOne(parseInt(cid), products)

        res.json({ message: 'Carrito modificado' })
    } catch (error) {
        res.status(500).json({ error })
    }
})

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const cart = await Cart.findOne({ id: parseInt(cid) })
        const newData = cart.products.map(product => {
            if (product.pid === parseInt(pid)) {
                product.quantity = parseInt(quantity)
            }
            return product;
        });
        await Cart.updateOne(parseInt(cid), newData)
        res.json({ message: 'Producto modificado'})
    } catch (error) {
        res.status(400).json({ error });
    }
})

module.exports = router;