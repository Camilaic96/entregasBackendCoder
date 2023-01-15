import fs from 'fs'

class ProductManager {
    constructor(path) {
        this.path = path
    }

    async getProducts() {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8')
                const products = JSON.parse(data)
                return products
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
                const data = await fs.promises.readFile(this.path, 'utf-8')
                const product = JSON.parse(data).find(product => product.id === idProduct)
                if (product) {
                    return product
                } else {
                    return "Not found"
                }
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

const manejadorDeProductos = new ProductManager('./productsList.json')

//TESTING
const newProduct = {
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc123',
    stock: 25
}
const nuevo = {
    title: "prueba cambio valor campo",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc123',
    stock: 25
}

const testing = async () => {
    console.log("prueba getProducts vacío: ", await manejadorDeProductos.getProducts())
    console.log("Agregar un producto")
    await manejadorDeProductos.addProduct(newProduct)
    console.log("prueba getProducts con el producto agregado:\n", await manejadorDeProductos.getProducts())
    console.log("Agregar dos productos más")
    await manejadorDeProductos.addProduct(newProduct)
    await manejadorDeProductos.addProduct(newProduct)
    console.log("prueba getProductById existente id 3:\n", await manejadorDeProductos.getProductById(3))
    console.log("prueba getProductById no existente id 8: ", await manejadorDeProductos.getProductById(8))
    console.log("prueba updateProduct name prod id 2:\n", await manejadorDeProductos.updateProduct(2, nuevo))
    console.log("prueba getProductById después del cambio de nombre id 2:\n", await manejadorDeProductos.getProductById(2))
    console.log("prueba deleteProduct id 1:\n", await manejadorDeProductos.deleteProduct(1))
    console.log("prueba getProductById después de eliminar id 1:\n", await manejadorDeProductos.getProductById(1))
}

testing()