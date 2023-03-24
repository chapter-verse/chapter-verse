const router = require('express').Router();
const User = require('../models/User.model');
const session = require('express-session');
const bcrypt = require('bcrypt');

router
	.route('/')
	.get((req, res) => res.render('login'))

	.post(async (req, res, next) => {
		const { username, password } = req.body;
		try {
			const user = await User.findOne({ username });
			if (!user) {
				res.render('login', { errorMessage: 'Wrong Username or Password.' });
				return;
			}
			const passwordMatch = await bcrypt.compare(password, user.password);
			if (passwordMatch) {
				req.session.currentUser = user;
				res.redirect('/');
			} else {
				res.render('login', { errorMessage: 'Wrong Username or Password.' });
			}
		} catch (error) {
			next(error);
		}
	});

module.exports = router;
