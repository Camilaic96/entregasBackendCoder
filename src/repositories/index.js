const UsersRepository = require('./User.repository');
const ProductsRepository = require('./Product.repository');
const CartsRepository = require('./Cart.repository');
const TicketsRepository = require('./Ticket.repository');
const factory = require('../dao/factory.js');

const usersRepository = new UsersRepository(new factory.UsersDAO());
const productsRepository = new ProductsRepository(new factory.ProductsDAO());
const cartsRepository = new CartsRepository(new factory.CartsDAO());
const ticketsRepository = new TicketsRepository(new factory.TicketsDAO());

module.exports = {
	usersRepository,
	productsRepository,
	cartsRepository,
	ticketsRepository,
};
