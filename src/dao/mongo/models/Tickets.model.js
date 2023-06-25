const mongoose = require('mongoose');

const ticketCollection = 'ticket';

const ticketSchema = new mongoose.Schema({
	code: {
		type: String,
		required: true,
	},
	purchase_datetime: Date,
	amount: {
		type: Number,
		default: 0,
	},
	purchaser: {
		type: String,
		required: true,
	},
});

const Ticket = mongoose.model(ticketCollection, ticketSchema);

module.exports = Ticket;
