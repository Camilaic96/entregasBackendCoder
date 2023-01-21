const express = require('express');
const ProductManager = require('./class/ProductManager.js');
const port = 8080;

const app = express();

const manejadorDeProductos = new ProductManager('./src/productsList.json');

app.get('/products', async (req, res) => {
    const { limit } = req.query;
    const products = await manejadorDeProductos.getProducts();
    const response = limit ? products.slice(0, Number(limit)) : products;
    res.json({ message: response });
})

app.get('/products/:pid', async (req, res) => {
    const { pid } = req.params;
    productById = await manejadorDeProductos.getProductById(Number(pid))
    res.json({ message: productById });
})

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});