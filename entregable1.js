class ProductManager {
    constructor(){
        this.products = []
        this.id = 0
    }

    addProduct(title, description, price, thumbnail, code, stock){
        this.id++

        const newProduct = this.products.find(newProduct => newProduct.code === code)

        if (!newProduct) {
            const product = {
                id: this.id,
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            }

            this.products.push(product)

            return `Se agregó correctamente el producto de código: ${code}`
        } else {
            return `No es posible realizar la carga. Ya existe un producto con el código: ${code}`
        }
    }

    getProducts(){
        return this.products
    }

    getProductById(idProduct){
        const product = this.products.find(product => product.id === idProduct)

        if (!product) {
            return `Not found`
        }

        return product
    }
}

const manejadorDeProductos = new ProductManager()

console.log(manejadorDeProductos.getProducts())

console.log(manejadorDeProductos.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25))

console.log(manejadorDeProductos.getProducts())

console.log(manejadorDeProductos.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25))

console.log(manejadorDeProductos.getProductById(65))
console.log(manejadorDeProductos.getProductById(1))
