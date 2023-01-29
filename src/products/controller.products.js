const { Router } = require('express');
const ProductManager = require('./class/ProductManager.js');

const router = Router();

const manejadorDeProductos = new ProductManager('./src/products/productsList.json');

router.get('/', async (req, res) => {
    const { limit } = req.query;
    const products = await manejadorDeProductos.getProducts();
    const response = limit ? products.slice(0, Number(limit)) : products;
    res.json({ message: response });
})

router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    productById = await manejadorDeProductos.getProductById(Number(pid))
    if(!productById) {
        return res.status(400).json( {error: 'No existe el producto' });
    }
    res.status(200).json({ message: productById });
})

router.post('/', async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    if ( !title || !description || !code || !price || !status || !stock || !category ) {
        return res.status(400).json( {error: 'Faltan datos' });
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
    
    if(!await manejadorDeProductos.updateProduct(Number(pid), newDataProduct)) {
        return res.status(400).json( {error: 'No existe el producto' });
    }
    res.json({ message: 'Producto modificado'});
})

router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    productById = await manejadorDeProductos.deleteProduct(Number(pid))
    if(!productById) {
        return res.status(400).json( {error: 'No existe el producto' });
    }
    res.json({ message: `Producto de id ${pid} eliminado` });
})

module.exports = router;