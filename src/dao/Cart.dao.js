const fs = require('fs');
const Cart = require('./models/Carts.model')

class CartDao {
    constructor(path) {
        this.path = path
    }

    async getCarts() {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                const carts = JSON.parse(data);
                return carts;
            }
            return []

        } catch (error) {
            console.log(error)
        }
    }

    async getCartById(idCart) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(cart => cart.id === idCart);
            return (cart ? cart : false );
        } catch (error) { 
            console.log(error)
        }
    }

    async addCart(prods) {
        try {
            let id;
            const carts = await this.getCarts();
            carts.length === 0 ? id = 1 : id = carts[carts.length - 1].id + 1;

            const newCart = {
                id,
                products: prods
            }
            carts.push(newCart);
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));

            return newCart
        } catch (error) {
            console.log(error)
        }
    }

    async addProductToCart(cid, pid, quantity) {
        try {
                const carts = await this.getCarts();
                const cart = await this.getCartById(cid);
                let product = cart.products.find(product => product.pid === pid)
                product ? product.quantity += quantity : cart.products.push({ pid, quantity })
                
                const indexDelete = carts.findIndex(cart => parseInt(cart.id) === cid)
                if (indexDelete === -1) { return false }
                carts.splice(indexDelete, 1)      

                const changedCart = {
                    id: cid,
                    products: [...cart.products]
                }
                carts.push(changedCart);

                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
        } catch (error) {
            console.log(error)
        }
    }

    async find() {
        try {
            const carts = await Cart.find()
            return carts
        } catch (error) {
            return error
        }
    }

    async findOne(param) {
        try {
            const cart = await Cart.findOne(param)
            return cart
        } catch (error) {
            return error
        }
    }
    
    async insertMany(newCarts) {
        try {
            const carts = await Cart.insertMany(newCarts)
            return carts
        } catch (error) {
            return error
        }
    }

    async create(newCart) {
        try {
            await Cart.create(newCart)
            return 'Carrito creado'
        } catch (error) {
            return error
        }
    }
/*
    async updateOne(rule, newData, option) {
        try {
            const cart = await Cart.updateOne(rule, newData, option)
            return cart
        } catch (error) {
            return error
        }
    }
*/
    async updateOne(cartId, newProducts) {
        try {
            const cart = await Cart.findOne({ id: cartId })
            cart.products = newProducts
            const response = Cart.updateOne({ id: cartId }, cart)
            console.log(response)
            return response
        } catch (error) {
            return error
        }
    }

    async deleteOne(param) {
        try {
            const cart = await Cart.deleteOne(param)
            return cart
        } catch (error) {
            return error
        }
    }

    async deleteMany() {
        try {
            await Cart.deleteMany()
            return 'Carritos eliminados'
        } catch (error) {
            return error
        }
    }
}

module.exports = CartDao;