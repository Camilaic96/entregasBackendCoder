const fs = require('fs');

class CartManager {
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
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                const cart = JSON.parse(data).find(cart => cart.id === idCart);
                return (cart ? cart : "Not found" );
            }
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

            return cart
        } catch (error) {
            console.log(error)
        }
    }

    async addProductToCart(cid, pid, quantity) {
        try {
                const carts = await this.getCarts();
                const cart = await this.getCartById(cid);
                let products = cart.products;
                let product = products.find(product => product.pid === pid)
                product ? product.quantity += quantity : products.push({ pid, quantity })
                
                const indexDelete = carts.findIndex(cart => parseInt(cart.id) === cid)
                if (indexDelete === -1) { return "Not found" }
                carts.splice(indexDelete, 1)      

                const changedCart = {
                    id: cid,
                    products: [...products]
                }
                carts.push(changedCart);

                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = CartManager;