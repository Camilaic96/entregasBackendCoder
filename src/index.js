/* eslint-disable n/no-path-concat */
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const handlebars = require('express-handlebars');
const morgan = require('morgan');
const passport = require('passport');
const { Server } = require('socket.io');
const http = require('http');

require('./config/mongo.config');
const router = require('./router/app.js');
const { db } = require('./config');
const initializePassport = require('./config/passport.config.js');
const MessagesDao = require('./dao/mongoManager/Message.dao');

const app = express();

const { userDb, passDb } = db;

const Message = new MessagesDao('Messages.json');

const server = http.createServer(app);
const io = new Server(server);
global.io = io;

app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(
	session({
		store: MongoStore.create({
			mongoUrl: `mongodb+srv://${userDb}:${passDb}@coderbackend.0lx0bci.mongodb.net/Ecommerce-session?retryWrites=true&w=majority`,
			mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
		}),
		secret: 'Ecommerce',
		resave: false,
		saveUninitialized: false,
	})
);
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

router(app);

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

module.exports = { server, io, app };
