const { v4: uuidV4 } = require('uuid');

class TicketDTO {
	constructor(ticket) {
		this.code = uuidV4();
		this.purchase_datetime = Date.now();
		this.amount = ticket.number;
		this.purchaser = ticket.purchaser;
	}
}

module.exports = TicketDTO;
