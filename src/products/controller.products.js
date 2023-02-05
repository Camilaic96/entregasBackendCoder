const { Router } = require('express');
const uploader = require('../utils.js');
const ProductManager = require('./class/ProductManager.js');

const router = Router();

const manejadorDeProductos = new ProductManager('./src/products/productsList.json');

router.get('/', async (req, res) => {
    const { limit } = req.query;
    const products = await manejadorDeProductos.getProducts();
    const response = limit ? products.slice(0, Number(limit)) : products;
    res.render('home.handlebars', { products: response })
})

router.get('/realtimeproducts', async (req, res) => {
    const products = await manejadorDeProductos.getProducts();
    io.emit('mostrarProductos', products);
    res.render('realTimeProducts.handlebars', {})
})

router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    productById = await manejadorDeProductos.getProductById(Number(pid))
    if(!productById) {
        return res.status(400).json( {error: 'No existe el producto' });
    }
    res.status(200).json({ message: productById });
})

router.post('/realtimeproducts', uploader.array('files'), async (req, res) => {
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
        category
    }
    newProduct.thumbnails = []
    if(req.files){
        req.files.map(file => {
            newProduct.thumbnails.push(file.path)
        })
    }
    manejadorDeProductos.addProduct(newProduct)
    const products = await manejadorDeProductos.getProducts();
    global.io.emit('crearProducto', products);
    res.render('realTimeProducts.handlebars', {})
})

router.put('/realtimeproducts/:pid', uploader.array('files'), async (req, res) => {
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
        category
    }

    newDataProduct.thumbnails = []
    if(req.files){
        req.files.map(file => {
            newDataProduct.thumbnails.push(file.path)
        })
    }
    
    if(!await manejadorDeProductos.updateProduct(Number(pid), newDataProduct)) {
        return res.status(400).json( {error: 'No existe el producto' });
    }
    const products = await manejadorDeProductos.getProducts();
    global.io.emit('modificarProducto', products);
    res.render('realTimeProducts.handlebars', {})
})

router.delete('/realtimeproducts/:pid', async (req, res) => {
    const { pid } = req.params;
    productById = await manejadorDeProductos.deleteProduct(Number(pid))
    if(!productById) {
        return res.status(400).json( {error: 'No existe el producto' });
    }
    const products = await manejadorDeProductos.getProducts();
    global.io.emit('eliminarProducto', products);
    res.render('realTimeProducts.handlebars', {})
})

module.exports = router;