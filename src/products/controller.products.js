const { Router } = require('express');
const uploader = require('../utils.js');
const Product = require('../dao/models/Products.model')
const ProductManager = require('../dao/ProductManager.js');

const router = Router();

const manejadorDeProductos = new ProductManager('./src/files/Products.json');

router.get('/', async (req, res) => {
    /*
    const { limit } = req.query;
    const products = await manejadorDeProductos.getProducts();
    const response = limit ? products.slice(0, Number(limit)) : products;
    res.render('home.handlebars', { products: response })*/
    try {
        const { limit } = req.query;
        const products = await Product.find().limit(parseInt(limit));
        res.json({ message: products })
    } catch (error) {
        res.status(400).json({ error })
    }
})

router.get('/realtimeproducts', async (req, res) => {
    //const products = await manejadorDeProductos.getProducts();
    const products = await Product.find()
    global.io.emit('mostrarProductos', {});
    res.render('realTimeProducts.handlebars', products)
})

router.get('/:pid', async (req, res) => {
    /*
    const { pid } = req.params;
    productById = await manejadorDeProductos.getProductById(Number(pid))
    if (!productById) {
        return res.status(400).json({ error: 'No existe el producto' });
    }
    res.status(200).json({ message: productById });
    */
    try {
        const { pid } = req.params;
        const product = await Product.findOne({ id: parseInt(pid) });
        if (!product) {
            return res.status(400).json({ error: 'No se encontró ningún producto con el código especificado' });
        }
        res.status(200).json({ message: product });
    } catch (error) {
        res.status(400).json({ error });
    }
})

/*
router.post('/', uploader.array('files'), async (req, res) => {
    const products = await manejadorDeProductos.getProducts()
    await Product.insertMany(products)
    res.json({ message: 'Productos cargados' })
})
*/

router.post('/', uploader.array('files'), async (req, res) => {
    try {
        const { title, description, code, price, status, stock, category, thumbnails } = req.body;
        if (!title || !description || !code || !price || !status || !stock || !category) {
            return res.status(400).json({ error: 'Faltan datos' });
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
        if (req.files) {
            req.files.map(file => {
                newProduct.thumbnails.push(file.path)
            })
        }
        const response = await Product.create(newProduct)

        res.json({ message: response })
    } catch (error) {
        res.status(400).json({ error })
    }
})

router.post('/realtimeproducts', uploader.array('files'), async (req, res) => {
    /*
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    if (!title || !description || !code || !price || !status || !stock || !category) {
        return res.status(400).json({ error: 'Faltan datos' });
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
    if (req.files) {
        req.files.map(file => {
            newProduct.thumbnails.push(file.path)
        })
    }
    manejadorDeProductos.addProduct(newProduct)
    const products = await manejadorDeProductos.getProducts();*/
    try {
        const { title, description, code, price, status, stock, category, thumbnails } = req.body;
        if (!title || !description || !code || !price || !status || !stock || !category) {
            return res.status(400).json({ error: 'Faltan datos' });
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
        if (req.files) {
            req.files.map(file => {
                newProduct.thumbnails.push(file.path)
            })
        }
        await Product.create(newProduct)

        const products = await Product.find()
        global.io.emit('crearProducto', products);
        res.render('realTimeProducts.handlebars', {})
    } catch (error) {
        res.status(400).json({ error })
    }
})

router.put('/realtimeproducts/:pid', uploader.array('files'), async (req, res) => {
    /*
    const { pid } = req.params;
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    if (!title || !description || !code || !price || !status || !stock || !category) {
        return res.status(400).json({ error: 'Faltan datos' });
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
    if (req.files) {
        req.files.map(file => {
            newDataProduct.thumbnails.push(file.path)
        })
    }

    if (!await manejadorDeProductos.updateProduct(Number(pid), newDataProduct)) {
        return res.status(400).json({ error: 'No existe el producto' });
    }
    const products = await manejadorDeProductos.getProducts();
    global.io.emit('modificarProducto', products);
    res.render('realTimeProducts.handlebars', {})
    */
    try {
        const { pid } = req.params;
        const { title, description, code, price, status, stock, category, thumbnails } = req.body;
        if (!title || !description || !code || !price || !status || !stock || !category) {
            return res.status(400).json({ error: 'Faltan datos' });
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
        if (req.files) {
            req.files.map(file => {
                newDataProduct.thumbnails.push(file.path)
            })
        }

        const result = await Product.updateOne({ id: parseInt(pid) }, newDataProduct, { new: true });
        if (result.nModified === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const products = await Product.find()
        global.io.emit('modificarProducto', products);
        res.render('realTimeProducts.handlebars', {})
    } catch (error) {
        res.status(400).json({ error });
    }
})

router.delete('/realtimeproducts/:pid', async (req, res) => {
    const { pid } = req.params;
    /*
    productById = await manejadorDeProductos.deleteProduct(Number(pid))
    if (!productById) {
        return res.status(400).json({ error: 'No existe el producto' });
    }
    const products = await manejadorDeProductos.getProducts();
    */
    try {
        const result = await Product.deleteOne({ id: parseInt(pid) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        const products = Product.find()
        global.io.emit('eliminarProducto', products);
        res.render('realTimeProducts.handlebars', {})
    } catch (error) {
        res.status(400).json({ error: error.message });
    }    
})

router.delete('/', async (req, res) => {
    await Product.deleteMany()
    res.json({ message: 'Todos los productos eliminados' })
})

module.exports = router;