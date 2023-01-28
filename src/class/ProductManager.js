const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path
    }

    async getProducts() {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                const products = JSON.parse(data);
                return products;
            }
            return []

        } catch (error) {
            console.log(error)
        }
    }

    async addProduct(product) {
        try {
            const products = await this.getProducts();
            products.length === 0 ? product.id = 1 : product.id = products[products.length - 1].id + 1;
            products.push(product);

            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));

            return product
        } catch (error) {
            console.log(error)
        }
    }

    async getProductById(idProduct) {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                const product = JSON.parse(data).find(product => product.id === idProduct);
                return (product ? product : "Not found" );
            }
        } catch (error) {
            console.log(error)
        }
    }

    async updateProduct(idProduct, newData) {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8')
                const products = JSON.parse(data)
                const indexDelete = products.findIndex(product => parseInt(product.id) === parseInt(idProduct))
                if (indexDelete === -1) { return "Not found" }
                products.splice(indexDelete, 1)               
                const changedProduct = {
                    id: idProduct,
                    ...newData
                }
                products.push(changedProduct);
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
            }
        } catch (error) {
            console.log(error)
        }
    }

    async deleteProduct(idProduct) {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8')
                const products = JSON.parse(data)
                const indexDelete = products.findIndex(product => parseInt(product.id) === parseInt(idProduct))
                if (indexDelete === -1) { return "Not found" }
                products.splice(indexDelete, 1)
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
            }
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = ProductManager;