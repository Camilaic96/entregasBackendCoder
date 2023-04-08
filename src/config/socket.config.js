const { Server } = require('socket.io');
const http = require('http');

const MessagesDao = require('../dao/mongoManager/Message.dao');
const app = require('../app');

const Message = new MessagesDao('Messages.json');

const server = http.createServer(app);

const io = new Server(server);
global.io = io;

io.on('connection', socket => {
	console.log(`Client with id: ${socket.id}`);

	socket.on('newUser', async user => {
		socket.emit('userConnected', user);
		const messages = await Message.find();
		socket.emit('messageLogs', messages);
	});

	socket.on('message', async data => {
		Message.create(data);
		const messages = await Message.find();
		io.emit('messageLogs', messages);
	});

	socket.on('disconnect', () => {
		console.log('socket disconnected');
	});
});
