const { Router } = require('express');
const uploader = require('../utils.js');

const ProductDao = require('../dao/mongoManager/Product.dao.js');
const Product = new ProductDao('Products.json');
const FilesDao = require('../dao/fsManager/Files.dao')
const FilesManager = new FilesDao('Products.json')

const router = Router();

const mapProducts = (prod) => {
    const products = prod.map(({ _id, title, description, code, price, stock, status, category, thumbnails}) => ({
        id: _id,
        title,
        description,
        code,
        price,
        stock,
        status,
        category,
        thumbnails
    }))
    return products
}

router.get('/', async (req, res) => {
    try {
        const { user } = req.session
        const limit = parseInt(req.query.limit) || 10
        const page = parseInt(req.query.page) || 1
        let sort = req.query.sort ? req.query.sort.toLowerCase() : '';
        sort = sort === 'asc' ? 1 
            : sort === 'desc' ? -1 
            : undefined
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
        const products = mapProducts(productsBd.docs)

        res.render('home.handlebars', { products, user })
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
        const products = mapProducts(productsBd.docs)

        global.io.emit('mostrarProductos', products);
        res.render('realTimeProducts.handlebars', { products })
    } catch (error) {
        res.status(400).json({ error })
    }
})

router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await Product.findOne({ _id: pid });
        if (!product) {
            return res.status(400).json({ error: 'Product not found' });
        }
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
            return res.status(400).json({ error: 'Incomplete data' });
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
            return res.status(400).json({ error: 'Incomplete data' });
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

        const productsBd = await Product.find()
        const products = mapProducts(productsBd.docs)

        global.io.emit('showProducts', products);
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
            return res.status(400).json({ error: 'Incomplete data' });
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

        const result = await Product.updateOne({ _id: pid }, newDataProduct, { new: true });
        if (result.nModified === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const productsBd = await Product.find()
        const products = mapProducts(productsBd.docs)

        global.io.emit('showProducts', products);
        res.render('realTimeProducts.handlebars', {})
    } catch (error) {
        res.status(400).json({ error });
    }
})

router.delete('/realtimeproducts/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const result = await Product.deleteOne({ _id: pid });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        const productsBd = await Product.find()
        const products = mapProducts(productsBd.docs)

        global.io.emit('showProducts', products);
        res.render('realTimeProducts.handlebars', {})
    } catch (error) {
        res.status(400).json({ error: error.message });
    }    
})

//Delete all products bd
router.delete('/', async (req, res) => {
    await Product.deleteMany()
    res.json({ message: 'All products deleted' })
})

module.exports = router;