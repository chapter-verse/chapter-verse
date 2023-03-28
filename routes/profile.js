const router = require('express').Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');

router.get('/:username', (req, res) => {
	const { username } = req.params;
	User.findOne({ username })
	.populate('collections')
	.then((data) => {
		const {birthday} = data
		console.log(birthday)
		res.render('profile', data)})
		.catch((err) => console.log(err));
});

module.exports = router;

router.get('/:userId/edit', (req, res, next) => {
	const { userId } = req.params;
	User.findById(userId)
		.then((data) => {
			res.render('edit-profile', data);
			console.log(data);
		})
		.catch((err) => {
			console.log(err);
			next(err);
		});
});

router.post('/:userId/edit', (req, res, next) => {
	const { userId } = req.params;
	const { username, description, birthday } = req.body;

	User.findByIdAndUpdate(userId, { username, description, birthday }, { new: true })
		.then(() => {
			res.redirect(`/profile/${username}`);
		})
		.catch((err) => {
			console.log(err);
			next(err);
		});
});
