const fs = require('fs');

class productManager {
    constructor(file) {
        this.file = `${process.cwd()}/src/files/${file}`
    }

    async getProducts() {
        try {
            if (fs.existsSync(this.file)) {
                const data = await fs.promises.readFile(this.file, 'utf-8');
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
            await fs.promises.writeFile(this.file, JSON.stringify(products, null, '\t'));
            return product
        } catch (error) {
            console.log(error)
        }
    }

    async getProductById(idProduct) {
        try {
            const products = await this.getProducts();
            const product = products.find(product => product.id === idProduct);
            return (product ? product : false );
        } catch (error) {
            console.log(error)
        }
    }

    async updateProduct(idProduct, newData) {
        try {
            const products = await this.deleteProduct(idProduct);
            if (!products) { return false }
            const changedProduct = {
                id: idProduct,
                ...newData
            }
            products.push(changedProduct);
            await fs.promises.writeFile(this.file, JSON.stringify(products, null, '\t'));
            return changedProduct;
        } catch (error) {
            console.log(error)
        }
    }

    async deleteProduct(idProduct) {
        try {
            const products = await this.getProducts();
            const indexDelete = products.findIndex(product => parseInt(product.id) === parseInt(idProduct))
            if (indexDelete === -1) { return false }
            products.splice(indexDelete, 1)
            await fs.promises.writeFile(this.file, JSON.stringify(products, null, '\t'));
            return products;
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = productManager;