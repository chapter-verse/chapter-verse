const router = require('express').Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const saltRounds = 10;

router
	.route('/')
	.get((req, res) => res.render('register'))
	.post((req, res) => {
		const { username, email, password } = req.body;
		bcrypt
			.genSalt(saltRounds)
			.then((salt) => bcrypt.hash(password, salt))
			.then((hashedPassword) => {
				return User.create({
					username,
					email,
					password: hashedPassword,
				});
			})
			.then(() => {
				res.render('login', { message: 'Account created, please log in.' });
			})
			.catch((error) => {
				if (error.message.includes('E11000')) {
					res.render('register', { errorMessage: 'Username or Password already exist.' });
				} else res.render('register', { errorMessage: 'An error occured.' });
			});
	});

module.exports = router;
