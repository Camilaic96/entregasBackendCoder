const Ticket = require('../models/Tickets.model');

class TicketMongoDAO {
	constructor(file) {
		this.file = `${process.cwd()}/src/files/${file}`;
	}

	async find() {
		try {
			const tickets = await Ticket.find();
			return tickets;
		} catch (error) {
			return error;
		}
	}

	async findOne(param) {
		try {
			const ticket = await Ticket.findOne(param);
			return ticket;
		} catch (error) {
			return error;
		}
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
const Tickets = new TicketMongoDAO();
module.exports = Tickets;
