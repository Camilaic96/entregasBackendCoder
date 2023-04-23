const mongoose = require('mongoose');

const ticketCollection = 'ticket';

const ticketSchema = new mongoose.Schema({
	code: {
		type: String,
		required: true,
	}, // hacer con uuid
	purchase_datetime: String, // fecha y hora exacta en la cual se formalizó la compra (básicamente es un created_at). Crearla con Date()
	amount: Number,
	purchaser: {
		type: String,
		required: true,
	}, // correo del usuario asociado al carrito
});

const Ticket = mongoose.model(ticketCollection, ticketSchema);

module.exports = Ticket;
