const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

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
    /*
    category: {
        type: String,
        enum: ['1', '2', '3'],
        default: '1'
    },
    */
    thumbnail: String
})

productSchema.plugin(mongoosePaginate)
const Product = mongoose.model(productCollection, productSchema)

module.exports = Product