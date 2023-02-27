const { Router } = require('express');
const uploader = require('../utils.js');

const ProductDao = require('../dao/mongoManager/Product.dao.js');
const Product = new ProductDao('Products.json');
const FilesDao = require('../dao/fsManager/Files.dao')
const FilesManager = new FilesDao('Products.json')

const router = Router();

router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10
        const page = parseInt(req.query.page) || 1
        let sort = req.query.sort ? req.query.sort.toLowerCase() : '';
        sort = sort === 'asc' ? 1 :
        sort === 'desc' ? -1 :
        undefined
        const optionsFind = {
            page,
            limit,
            sort: { price: sort }
        }
        const category = req.query.category;
        const stock = req.query.stock;
        const filter = {
            ...(category && { category }),
            ...(stock && { stock: parseInt(stock) }),
        };

        const productsBd = await Product.find(optionsFind, filter)
        const products = productsBd.docs.map(({ id, title, description, code, price, stock, status, category, thumbnails}) => ({
            id,
            title,
            description,
            code,
            price,
            stock,
            status,
            category,
            thumbnails
        }))
        res.render('home.handlebars', { products })
    } catch (error) {
        res.status(400).json({ error })
    }
})

router.get('/realtimeproducts', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10
        const page = parseInt(req.query.page) || 1
        let sort = req.query.sort ? req.query.sort.toLowerCase() : '';
        sort = sort === 'asc' ? 1 :
        sort === 'desc' ? -1 :
        undefined
        const optionsFind = {
            page,
            limit,
            sort: { price: sort }
        }
        const category = req.query.category;
        const stock = req.query.stock;
        const filter = {
            ...(category && { category }),
            ...(stock && { stock: parseInt(stock) }),
        };

        const productsBd = await Product.find(optionsFind, filter)
        const products = productsBd.docs.map(({ id, title, description, code, price, stock, status, category, thumbnails}) => ({
            id,
            title,
            description,
            code,
            price,
            stock,
            status,
            category,
            thumbnails
        }))
        global.io.emit('eliminarProducto', products);
        res.render('realTimeProducts.handlebars', {})
    } catch (error) {
        res.status(400).json({ error })
    }
})

router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await Product.findOne({ id: parseInt(pid) });
        if (!product) {
            return res.status(400).json({ error: 'No se encontró ningún producto con el código especificado' });
        }
        console.log(product)
        res.render('productId.handlebars', product )
    } catch (error) {
        res.status(400).json({ error });
    }
})

router.post('/populate', uploader.array('files'), async (req, res) => {
    const products = await FilesManager.loadItems()
    const response = await Product.insertMany(products)
    res.json({ message: response })
})

router.post('/', uploader.array('files'), async (req, res) => {
    try {
        const { title, description, code, price, status, stock, category, thumbnails } = req.body;
        if (!title || !description || !code || !price || !stock || !category) {
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

        const productsBD = await Product.find()
        const products = productsBD.docs.map(({ id, title, description, code, price, stock, status, category, thumbnails}) => ({
            id,
            title,
            description,
            code,
            price,
            stock,
            status,
            category,
            thumbnails
        }))
        global.io.emit('crearProducto', products);
        res.render('realTimeProducts.handlebars', {})
    } catch (error) {
        res.status(400).json({ error })
    }
})

router.put('/realtimeproducts/:pid', uploader.array('files'), async (req, res) => {
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

        const productsBd = await Product.find()
        const products = productsBd.docs.map(({ id, title, description, code, price, stock, status, category, thumbnails}) => ({
            id,
            title,
            description,
            code,
            price,
            stock,
            status,
            category,
            thumbnails
        }))
        global.io.emit('modificarProducto', products);
        res.render('realTimeProducts.handlebars', {})
    } catch (error) {
        res.status(400).json({ error });
    }
})

router.delete('/realtimeproducts/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const result = await Product.deleteOne({ id: parseInt(pid) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        const productsBd = await Product.find()
        const products = productsBd.docs.map(({ id, title, description, code, price, stock, status, category, thumbnails}) => ({
            id,
            title,
            description,
            code,
            price,
            stock,
            status,
            category,
            thumbnails
        }))
        global.io.emit('eliminarProducto', products);
        res.render('realTimeProducts.handlebars', {})
    } catch (error) {
        res.status(400).json({ error: error.message });
    }    
})

//Delete all products bd
router.delete('/', async (req, res) => {
    await Product.deleteMany()
    res.json({ message: 'Todos los productos eliminados' })
})

module.exports = router;