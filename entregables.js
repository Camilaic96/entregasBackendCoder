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
                if (!product) { return `Not found` }
                return product
            }
        } catch (error) {
            console.log(error)
        }
    }

    async updateProduct(idProduct, newData) {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8')
                const product = JSON.parse(data).find(product => product.id === idProduct)
                changedProduct = {
                    id: idProduct,
                    ...newData
                }
                this.addProduct(changedProduct);
                console.log(changedProduct)
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
                if (indexDelete !== -1) {
                    products.splice(indexDelete, 1)
                    await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
                    console.log("Producto de id " + parseInt(idProduct) + " ha sido eliminado")
                } else {
                    console.log("No existe el producto de id " + parseInt(idProduct))
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
}

const manejadorDeProductos = new ProductManager('./productsList.json')

const newProduct = {
    title: "ajedrez",
    description: "fsdfsf",
    price: 1000,
    thumbnail: 'https://http2.mlstatic.com/D_NQ_NP_13522-MLA3016582739_082012-O.jpg',
    code: 12346,
    stock: 3
}

const promesa2 = async () => {
    await manejadorDeProductos.addProduct(newProduct)
}
const promesa = async () => {
    await manejadorDeProductos.getProducts()
}
//promesa()

//promesa2()

const promesa3 = async () => {
    await manejadorDeProductos.getProductById(5)
}
//promesa3()

const promesa4 = async () => {
    await manejadorDeProductos.deleteProduct(5)
}
//promesa4()

const promesa5 = async () => {
    const nuevo = {
        title: "prueba nuevo",
        description: "fsdfsf",
        price: 1000,
        thumbnail: 'https://http2.mlstatic.com/D_NQ_NP_13522-MLA3016582739_082012-O.jpg',
        code: 12346,
        stock: 3
    }

    await manejadorDeProductos.changedProduct(3, nuevo)
}
promesa5()


/*
console.log(manejadorDeProductos.getProducts())

console.log(manejadorDeProductos.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25))

console.log(manejadorDeProductos.getProducts())

console.log(manejadorDeProductos.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25))

console.log(manejadorDeProductos.getProductById(65))
console.log(manejadorDeProductos.getProductById(1))
*/