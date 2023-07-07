/* eslint-disable camelcase */
const passport = require('passport');
const local = require('passport-local');
const GitHubStrategy = require('passport-github2');
const GoogleStrategy = require('passport-google-oauth20');
const jwt = require('passport-jwt');

const { comparePassword } = require('../utils/bcrypt.utils');
const cookieExtractor = require('../utils/cookieExtractor.utils');
const Users = require('../services/users.service');
const Carts = require('../services/carts.service');

const { github, google, jwtToken } = require('.');
const { CLIENT_ID_GITHUB, CLIENT_SECRET_GITHUB, URL_GITHUB } = github;
const { CLIENT_ID_GOOGLE, CLIENT_SECRET_GOOGLE, URL_GOOGLE } = google;
const { SECRET_KEY } = jwtToken;

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const initializePassport = () => {
	passport.use(
		'register',
		new LocalStrategy(
			{ passReqToCallback: true, usernameField: 'email' },
			async (req, username, password, done) => {
				try {
					const user = await Users.findOne({ email: username });
					req.body.carts = await Carts.create();
					if (user) {
						req.logger.error('User already exists');
						return done(null, false);
					}
					const newUser = await Users.create(req.body);
					return done(null, newUser);
				} catch (error) {
					return done(error);
				}
			}
		)
	);

	passport.serializeUser((user, done) => {
		done(null, user._id);
	});

	passport.deserializeUser(async (_id, done) => {
		const user = await Users.findById(_id);
		done(null, user);
	});

	passport.use(
		'login',
		new LocalStrategy(
			{ usernameField: 'email' },
			async (username, password, done) => {
				try {
					const user = await Users.findOne({ email: username });
					if (!user) {
						console.log('User not found');
						return done(null, false);
					}
					if (!comparePassword(password, user)) return done(null, false);
					return done(null, user);
				} catch (error) {
					return done(error);
				}
			}
		)
	);

	passport.use(
		'github',
		new GitHubStrategy(
			{
				clientID: CLIENT_ID_GITHUB,
				clientSecret: CLIENT_SECRET_GITHUB,
				callbackURL: URL_GITHUB,
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					const user = await Users.findOne({ email: profile._json.email });
					if (!user) {
						const carts = await Carts.create();
						const newUserInfo = {
							first_name: profile._json.name,
							last_name: '',
							age: 18,
							email: profile._json.email,
							password: ' ',
							role: 'USER',
							carts,
						};
						const newUser = await Users.create(newUserInfo);

						return done(null, newUser);
					}
					done(null, user);
				} catch (error) {
					done(error);
				}
			}
		)
	);

	passport.use(
		'google',
		new GoogleStrategy(
			{
				clientID: CLIENT_ID_GOOGLE,
				clientSecret: CLIENT_SECRET_GOOGLE,
				callbackURL: URL_GOOGLE,
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					const user = await Users.findOne({ googleId: profile._json.sub });

					if (!user) {
						const carts = await Carts.create();
						const newUserInfo = {
							googleId: profile._json.sub,
							first_name: profile._json.given_name,
							last_name: profile._json.family_name,
							age: 18,
							email: profile._json.email,
							password: ' ',
							role: 'USER',
							carts,
						};

						const newUser = await Users.create(newUserInfo);
						return done(null, newUser);
					}

					done(null, user);
				} catch (error) {
					done(error);
				}
			}
		)
	);

	passport.use(
		'jwt',
		new JWTStrategy(
			{
				jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
				secretOrKey: SECRET_KEY,
			},
			async (jwt_payload, done) => {
				try {
					return done(null, jwt_payload);
				} catch (error) {
					return done(error);
				}
			}
		)
	);
};

module.exports = initializePassport;
