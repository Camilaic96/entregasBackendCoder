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
const errorHandler = require('./middlewares/handler.errors');
const loggerMiddleware = require('./middlewares/logger.middleware');
const {
	swaggerUiExpressServe,
	swaggerUiExpressSetup,
} = require('./config/swagger.config');

const router = require('./router/app');

const app = express();

app.use('/docs', swaggerUiExpressServe, swaggerUiExpressSetup);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cors());
app.use(loggerMiddleware);
app.use(morgan('combined'));
app.use(cookieParser(false));
app.use(session(sessionMongo));
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
initializePassport();
app.use(passport.initialize());
app.use(errorHandler);

router(app);

module.exports = { app };
