const mongoose = require('mongoose')

const productCollection = 'product'

const productSchema = new mongoose.Schema({
    id: Number,
    title: String,
    description: String,
    code: String,
    price: Number,
    status: {
        type: Boolean,
        default: true
    },
    stock: Number,
    category: String,
    thumbnail: String
})

const Product = mongoose.model(productCollection, productSchema)

module.exports = Product