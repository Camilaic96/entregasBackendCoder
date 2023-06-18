const UsersRepository = require('./User.repository');
const ProductsRepository = require('./Product.repository');
const CartsRepository = require('./Cart.repository');
const TicketsRepository = require('./Ticket.repository');
const {
	UsersDAO,
	ProductsDAO,
	CartsDAO,
	TicketsDAO,
} = require('../dao/factory');

const usersRepository = new UsersRepository(new UsersDAO());
const productsRepository = new ProductsRepository(new ProductsDAO());
const cartsRepository = new CartsRepository(new CartsDAO());
const ticketsRepository = new TicketsRepository(new TicketsDAO());

module.exports = {
	usersRepository,
	productsRepository,
	cartsRepository,
	ticketsRepository,
};
