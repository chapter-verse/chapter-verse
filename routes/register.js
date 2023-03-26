const router = require('express').Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const saltRounds = 10;

router
	.route('/')
	.get((req, res) => res.render('register'))
	.post(async (req, res) => {
		const { username, email, password } = req.body;
		try {
			await User.create({
				username,
				email,
				password,
			});
			res.render('login', { message: 'Account created, please Sign In.' });
		} catch (error) {
			if (error.message.includes('E11000')) {
				res.render('register', { errorMessage: 'Username or Email already exists.' });
			} else if (!username && !password && !email) {
				res.render('register', { errorMessage: 'Please fill out all the required fields.' });
			} else if (error.errors) {
				for (let key in error.errors) {
					const message = error.errors[key].message;
					res.render('register', { errorMessage: message });
				}
			}
		}
	});

module.exports = router;
