const UsersRepository = require('./User.repository');
const ProductsRepository = require('./Product.repository');
const CartsRepository = require('./Cart.repository');
const { UsersDAO, ProductsDAO, CartsDAO } = require('../dao/factory');

const usersRepository = new UsersRepository(new UsersDAO());
const productsRepository = new ProductsRepository(new ProductsDAO());
const cartsRepository = new CartsRepository(new CartsDAO());

module.exports = {
	usersRepository,
	productsRepository,
	cartsRepository,
};
