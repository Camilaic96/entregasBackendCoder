/* eslint-disable camelcase */
const passport = require('passport');
const local = require('passport-local');
const GitHubStrategy = require('passport-github2');
const GoogleStrategy = require('passport-google-oauth20');
const jwt = require('passport-jwt');

const Users = require('../services/users.service');

const { comparePassword } = require('../utils/bcrypt.utils');
const cookieExtractor = require('../utils/cookieExtractor.utils');

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
					const user = await Users.findUser({ email: username });
					if (user) {
						console.log('User already exists');
						return done(null, false);
					}

					const newUser = await Users.createUser(req.body);
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
		const user = await Users.findUserById(id);
		done(null, user);
	});

	passport.use(
		'login',
		new LocalStrategy(
			{ usernameField: 'email' },
			async (username, password, done) => {
				try {
					const user = await Users.findUser({ email: username });

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
					const user = await Users.findUser({ email: profile._json.email });
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
						const newUser = await Users.createUser(newUserInfo);

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
					const user = await Users.findUser({ googleId: profile._json.sub });

					if (!user) {
						const newUserInfo = {
							googleId: profile._json.sub,
							first_name: profile._json.given_name,
							last_name: profile._json.family_name,
							age: 18,
							email: profile._json.email || 'error@gmail.com', // Arreglar esto
							password: ' ',
							role: 'USER',
							carts: [],
						};

						const newUser = await Users.createUser(newUserInfo);
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
