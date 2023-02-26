const mongoose = require('mongoose')

const cartCollection = 'cart'

const cartSchema = new mongoose.Schema({
    id: Number,
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'product'
                }
            }
        ],
        default: []
    }
})

cartSchema.pre('find', function() {
    this.populate('products.product')
})

const Cart = mongoose.model(cartCollection, cartSchema)

module.exports = Cart