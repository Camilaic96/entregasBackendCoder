/* eslint-disable camelcase */
const passport = require('passport');
const local = require('passport-local');
const GitHubStrategy = require('passport-github2');
const GoogleStrategy = require('passport-google-oauth20');
const jwt = require('passport-jwt');

const { comparePassword } = require('../utils/bcrypt.utils');
const cookieExtractor = require('../utils/cookieExtractor.utils');
const Users = require('../services/users.service');

const { github, google, jwtToken } = require('./');
const { clientID_github, clientSecret_github } = github;
const { clientID_google, clientSecret_google } = google;
const { secretKey } = jwtToken;

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
					if (user) {
						req.logger.error('User already exists');
						return done(null, false);
					}
					const newUserInfo = req.body;
					const newUser = await Users.create(newUserInfo);
					return done(null, newUser);
				} catch (error) {
					return done(error);
				}
			}
		)
	);

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser(async (id, done) => {
		const user = await Users.findById(id);
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
				clientID: clientID_github,
				clientSecret: clientSecret_github,
				callbackURL: 'http://localhost:8080/api/auth/githubcallback',
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					const user = await Users.findOne({ email: profile._json.email });
					if (!user) {
						const newUserInfo = {
							first_name: profile._json.name,
							last_name: '',
							age: 18,
							email: profile._json.email,
							password: ' ',
							role: 'USER',
							carts: [],
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
				clientID: clientID_google,
				clientSecret: clientSecret_google,
				callbackURL: 'http://localhost:8080/api/auth/google/callback',
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					const user = await Users.findOne({ googleId: profile._json.sub });

					if (!user) {
						const newUserInfo = {
							googleId: profile._json.sub,
							first_name: profile._json.given_name,
							last_name: profile._json.family_name,
							age: 18,
							email: profile._json.email,
							password: ' ',
							role: 'USER',
							carts: [],
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
				secretOrKey: secretKey,
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
