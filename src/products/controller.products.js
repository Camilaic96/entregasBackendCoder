const { Router } = require('express');
const ProductManager = require('../class/ProductManager.js');

const router = Router();

const manejadorDeProductos = new ProductManager('./src/productsList.json');

router.get('/', async (req, res) => {
    const { limit } = req.query;
    const products = await manejadorDeProductos.getProducts();
    const response = limit ? products.slice(0, Number(limit)) : products;
    res.json({ message: response });
})

router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    productById = await manejadorDeProductos.getProductById(Number(pid))
    res.json({ message: productById });
})

router.post('/', async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    if ( !title || !description || !code || !price || !status || !stock || !category ) {
        return res.status(400).json( {error: 'Faltan datos' });
    }
    if(!thumbnails) {
        thumbnails = "";
    }
    const newProduct = {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
    }
    manejadorDeProductos.addProduct(newProduct)
    res.json({ message: 'Producto creado'});
})

router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    if ( !title || !description || !code || !price || !status || !stock || !category ) {
        return res.status(400).json( {error: 'Faltan datos' });
    }
    if(!thumbnails) {
        const thumbnails = "";
    }
    const newDataProduct = {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
    }
    await manejadorDeProductos.updateProduct(Number(pid), newDataProduct)
    res.json({ message: 'Hi products with PUT'});
})

router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    productById = await manejadorDeProductos.deleteProduct(Number(pid))
    res.json({ message: `Producto de id: ${pid} eliminado` });
})

module.exports = router;