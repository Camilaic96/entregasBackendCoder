const { Router } = require('express');
const passport = require('passport');
const UserDao = require('../dao/mongoManager/User.dao');
const { createHash } = require('../utils/cryptPassword');
const { generateToken } = require('../utils/jwt.utils');

const User = new UserDao();

const router = Router();

router.post(
	'/',
	passport.authenticate('login', { failureRedirect: 'failLogin' }),
	async (req, res) => {
		try {
			if (!req.user)
				return res.status(400).json({ error: 'Invalid credentials' });

			req.session.user = {
				first_name: req.user.first_name,
				last_name: req.user.last_name,
				age: req.user.age,
				email: req.user.email,
			};

			const token = generateToken(req.session.user);

			console.log(token);

			res.redirect('/api/products');
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: 'Internal server error' });
		}
	}
);

router.get('/failLogin', (req, res) => {
	console.log('Login failed');
	res.send({ error: 'Login failed' });
});

router.get(
	'/github',
	passport.authenticate('github', { scope: ['user:email'] }),
	async (req, res) => {}
);

router.get(
	'/githubcallback',
	passport.authenticate('github', { failureRedirect: '/login' }),
	async (req, res) => {
		req.session.user = req.user;
		res.redirect('/api');
	}
);

router.get(
	'/google',
	passport.authenticate('google', { scope: ['profile'] }),
	async (req, res) => {}
);

router.get(
	'/google/callback',
	passport.authenticate('google', { failureRedirect: '/login' }),
	async (req, res) => {
		req.session.user = req.user;
		res.redirect('/api');
	}
);

router.get('/logout', (req, res) => {
	req.session.destroy(error => {
		if (error) return res.json({ error });

		res.redirect('/api/login');
	});
});

router.patch('/forgotPassword', async (req, res) => {
	try {
		const { email, password } = req.body;

		const passwordHashed = createHash(password);

		await User.updateOne({ email }, { password: passwordHashed });

		res.json({ message: 'Updated password' });
	} catch (error) {
		res.json({ error });
	}
});

module.exports = router;
