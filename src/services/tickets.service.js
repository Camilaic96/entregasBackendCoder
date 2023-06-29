/* eslint-disable no-useless-catch */
// const { ticketsRepository } = require('../repositories');
// const Tickets = ticketsRepository;
const Tickets = require('../dao/mongo/mongoManager/Tickets.mongo');
const TicketDTO = require('../DTOs/Ticket.dto.js');

const find = async () => {
	try {
		const tickets = Tickets.find();
		return tickets;
	} catch (error) {
		throw error;
	}
};

const findOne = async params => {
	try {
		const { tid } = params;
		const ticket = await Tickets.findOne({ _id: tid });
		return ticket;
	} catch (error) {
		throw error;
	}
};

const create = async (products, purchaser) => {
	try {
		const amount = products.reduce(
			(total, product) => total + product.price * product.quantity,
			0
		);
		const newTicket = new TicketDTO({
			amount,
			purchaser,
		});
		const ticket = await Tickets.create(newTicket);

		return ticket;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	find,
	findOne,
	create,
};
