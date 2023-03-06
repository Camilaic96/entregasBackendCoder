const Product = require('../models/Products.model')

class ProductDao {
    constructor(file) {
        this.file = `${process.cwd()}/src/files/${file}`
    }

    async find(optionsFind, filter) {
        try {
            //const prevLink = `localhost:8080/api/products?page=${page}`
            //const nextLink = `localhost:8080/api/products?page=${page}`
            const products = await Product.paginate( filter, optionsFind )
            return products
        } catch (error) {
            return error
        }
    }

    async findOne(param) {
        try {
            const product = await Product.findOne(param)
            return product
        } catch (error) {
            return error
        }
    }
    
    async insertMany(newProducts) {
        try {
            const products = await Product.insertMany(newProducts)
            return products
        } catch (error) {
            return error
        }
    }

    async create(newProduct) {
        try {
            await Product.create(newProduct)
            return 'Product created'
        } catch (error) {
            return error
        }
    }

    async updateOne(rule, newData, option) {
        try {
            const product = await Product.updateOne(rule, newData, option)
            return product
        } catch (error) {
            return error
        }
    }

    async deleteOne(param) {
        try {
            const product = await Product.deleteOne(param)
            return product
        } catch (error) {
            return error
        }
    }
    
    async deleteMany() {
        try {
            await Product.deleteMany()
            return 'Products deleted'
        } catch (error) {
            return error
        }
    }
}

module.exports = ProductDao;