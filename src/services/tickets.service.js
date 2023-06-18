/* eslint-disable no-useless-catch */
const { ticketsRepository } = require('../repositories');
const Tickets = ticketsRepository;
const TicketDTO = require('../DTOs/Ticket.dto.js');

const create = async (products, owner) => {
	try {
		const amount = products.reduce(
			(total, product) => total + product.price,
			0
		);
		const newTicket = new TicketDTO({
			amount,
			purchaser: owner,
		});
		const ticket = await Tickets.create(newTicket);
		return ticket;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	create,
};
