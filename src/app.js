/* eslint-disable n/no-path-concat */
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const handlebars = require('express-handlebars');
const morgan = require('morgan');
const passport = require('passport');
const cors = require('cors');

require('./config/socket.config');
const sessionMongo = require('./config/sessionMongo.config');
const initializePassport = require('./config/passport.config.js');

const router = require('./router/app');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(session(sessionMongo));
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

router(app);

module.exports = { app };
