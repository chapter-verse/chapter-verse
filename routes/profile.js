const router = require('express').Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');

router.get('/:username', (req, res) => {
	const { username } = req.params;
	User.findOne({ username })
		.then((data) => res.render('profile', data))
		.catch((err) => console.log(err));
});

module.exports = router;

router.get('/:username/preferences', (req, res) => {
	const { username } = req.params;
	User.findOne({ username })
		.then((data) => res.render('preferences', data))
		.catch((err) => console.log(err));
});
