const Ticket = require('../models/Tickets.model');

class TicketDao {
	constructor(file) {
		this.file = `${process.cwd()}/src/files/${file}`;
	}

	async create(newTicket) {
		try {
			const ticket = await Ticket.create(newTicket);
			return ticket;
		} catch (error) {
			return error;
		}
	}
}

module.exports = TicketDao;
