const { Router } = require('express');

const CartDao = require('../dao/mongoManager/Cart.dao.js');
const Cart = new CartDao('Carts.json');
const ProductDao = require('../dao/mongoManager/Product.dao.js');
const Product = new ProductDao('Products.json');
const FilesDao = require('../dao/fsManager/Files.dao');
const CartManager = new FilesDao('Carts.json')

const router = Router();
/*
const mapProducts = (products) => {
    const mappedProducts = products.map(item => {
        return {
            id: item.product._id,
            title: item.product.title,
            description: item.product.description,
            code: item.product.code,
            price: item.product.price,
            status: item.product.status,
            stock: item.product.stock,
            category: item.product.category,
            thumbnail: item.product.thumbnail,
            quantity: item.quantity
        };
    });
    console(mappedProducts)
    return mappedProducts
}*/

router.get('/', async (req, res) => {
    try {
        const carts = await Cart.find()
        res.json({ response: carts })
    } catch (error) {
        res.status(500).json({ error })
    }
})

router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cartById = await Cart.findOne({ _id: cid });
        if (!cartById) {
            return res.status(400).json({ error: 'No existe el carrito' });
        }
        const products = cartById.products.map(item => {
            return {
                id: item.product._id,
                title: item.product.title,
                description: item.product.description,
                code: item.product.code,
                price: item.product.price,
                status: item.product.status,
                stock: item.product.stock,
                category: item.product.category,
                thumbnail: item.product.thumbnail,
                quantity: item.quantity
            };
        });
        
        res.render('cartId.handlebars', { products })
    } catch (error) {
        res.status(400).json({ error });
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
            if (!(await Cart.findOne({ id: products[i]['_id'] }))) {
                return res.status(400).json({ error: 'Productos inválidos' });
            }
        }
        const response = await Cart.create(newCart)

        res.json({ message: response })
    } catch (error) {
        res.status(400).json({ error })
    }
})

router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        if ((!quantity || parseInt(quantity) < 1) || !(await Cart.findOne({ _id: cid })) || !(await Product.findOne({ _id: pid }))) {
            return res.status(400).json({ error: 'Datos inválidos' });
        }

    } catch (error) {
        res.status(400).json({ error });
    }
})

router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const { products } = req.body

        await Cart.updateOne(cid, products)

        res.json({ message: 'Carrito modificado' })
    } catch (error) {
        res.status(500).json({ error })
    }
})

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const cart = await Cart.findOne({ _id: cid })
        const newData = cart.products.map(product => {
            if (product['_id'] === pid) {
                product.quantity = parseInt(quantity)
            }
            return product;
        });
        await Cart.updateOne(cid, newData)
        res.json({ message: 'Producto modificado' })
    } catch (error) {
        res.status(400).json({ error });
    }
})

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await Cart.findOne({ _id: cid })
        newProducts = cart.products.filter(product => product['_id'] !== pid)
        await Cart.updateOne(cid, newProducts)
        res.json({ message: 'Producto eliminado' })
    } catch (error) {
        res.status(400).json({ error });
    }
})

router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        await Cart.deleteOne({ _id: cid })
        res.json({ message: 'Carrito eliminado' })
    } catch (error) {
        res.status(400).json({ error });
    }
})

//Delete all carts bd
router.delete('/', async (req, res) => {
    await Cart.deleteMany()
    res.json({ message: 'Todos los carritos eliminados' })
})

module.exports = router;