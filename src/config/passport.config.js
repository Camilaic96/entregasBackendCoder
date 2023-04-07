/* eslint-disable camelcase */
const passport = require('passport');
const local = require('passport-local');
const GitHubStrategy = require('passport-github2');
const GoogleStrategy = require('passport-google-oauth20');
const jwt = require('passport-jwt');

const UserDao = require('../dao/mongoManager/User.dao');
const { isValidPasswordMethod } = require('../utils/cryptPassword');
const { github, google, jwtToken } = require('./');
const cookieExtractor = require('../utils/cookieExtractor.utils');

const { clientID_github, clientSecret_github } = github;
const { clientID_google, clientSecret_google } = google;
const { secretKey } = jwtToken;
const User = new UserDao();
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
					const user = await User.findOne({ email: username });
					if (user) {
						console.log('User already exists');
						return done(null, false);
					}

					const newUserInfo = {
						first_name: req.body.first_name,
						last_name: req.body.last_name,
						age: req.body.age,
						email: req.body.email,
						password: req.body.password,
						role: req.body.role,
						carts: req.body.carts,
					};

					const newUser = await User.create(newUserInfo);
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
		const user = await User.findById(id);
		done(null, user);
	});

	passport.use(
		'login',
		new LocalStrategy(
			{ usernameField: 'email' },
			async (username, password, done) => {
				try {
					const user = await User.findOne({ email: username });

					if (!user) {
						console.log('User not found');
						return done(null, false);
					}

					if (!isValidPasswordMethod(password, user)) return done(null, false);

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
					const user = await User.findOne({ email: profile._json.email });
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
						const newUser = await User.create(newUserInfo);

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
					console.log(profile);
					const user = await User.findOne({ googleId: profile._json.sub });

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

						const newUser = await User.create(newUserInfo);
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
