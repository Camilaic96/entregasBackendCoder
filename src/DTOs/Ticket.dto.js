const { v4: uuidV4 } = require('uuid');

class TicketDTO {
	constructor(ticket) {
		this.code = uuidV4();
		this.purchase_datetime = Date();
		this.amount = ticket.amount;
		this.purchaser = ticket.purchaser;
	}
}

module.exports = TicketDTO;
