const app = require('./index')
const { port } = require('./config')
const { Server } = require('socket.io');

const MessagesDao = require('./dao/Message.dao.js')
const Message = new MessagesDao('Messages.json');

const httpServer = app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});

global.io = new Server(httpServer);

io.on('connection', socket => {
    console.log(`Client with id: ${socket.id}`)

    socket.on('newUser', async user => {
        socket.broadcast.emit('userConnected', user)
        const messages = await Message.find()
        socket.emit('messageLogs', messages)
    })

    socket.on('message', async data => {
        Message.create(data)
        const messages = await Message.find()
        io.emit('messageLogs', messages)
    })

    socket.on('disconnect', () => {
        console.log('socket disconnected');
    });
})