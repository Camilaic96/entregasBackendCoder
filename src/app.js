const express = require('express');
const handlebars = require('express-handlebars');
const morgan = require('morgan');
const { Server } = require('socket.io');
const router = require('./router/app.js');
const { port } = require('./config')
const mongoose = require('mongoose')
const { db } = require('./config')
const { userDb, passDb } = db

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended:true }));

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');

router(app);

mongoose.set('strictQuery', false)
mongoose.connect(`mongodb+srv://${userDb}:${passDb}@coderbackend.0lx0bci.mongodb.net/Ecommerce?retryWrites=true&w=majority`, error => {
    if (error) {
        console.log(`Cannot connect to db. Error ${error}`)
    }
    console.log('db connected')
})

const httpServer = app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});

global.io = new Server(httpServer);


const messages = []

global.io.on('connection', socket => {
    console.log(`Client with id: ${socket.id}`)

    socket.on('newUser', user => {
        socket.broadcast.emit('userConnected', user)

        socket.emit('messageLogs', messages)
    })

    socket.on('message', data => {
        messages.push(data)
        io.emit('messageLogs', data)
    })
})