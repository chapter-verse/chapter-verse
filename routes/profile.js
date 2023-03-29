const router = require('express').Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const fileUploader = require('../config/cloudinary.config');

router.get('/:username', (req, res) => {
	const { username } = req.params;
	const currentUser = req.session.currentUser.username;
	if (username === currentUser) {
		User.findOne({ username })
			.populate('collections')
			.then((data) => {
				let booksNb = 0;
				let { collections } = data;
				collections.forEach((element) => {
					let { books } = element;
					booksNb += books.length;
				});
				res.render('user-profile', { data, booksNb });
			})
			.catch((err) => console.log(err));
	} else {
		User.findOne({ username })
			.populate('collections')
			.then((data) => {
				let booksNb = 0;
				let { collections } = data;
				collections.forEach((element) => {
					let { books } = element;
					booksNb += books.length;
				});
				res.render('profile', { data, booksNb });
			})
			.catch((err) => console.log(err));
	}
});

module.exports = router;

router.post('/:userId/edit', (req, res, next) => {
	console.log(req);
	const { userId } = req.params;
	const { username, description, birthday } = req.body;

	User.findByIdAndUpdate(userId, { username, description, birthday}, { new: true })
		.then(() => {
			res.redirect(`/profile/${username}`);
		})
		.catch((err) => {
			console.log(err);
			next(err);
		});
});

router.post('/:userId/edit-avatar',fileUploader.single('avatar'), (req, res, next) => {
	const { userId } = req.params;
	const { username } = req.session.currentUser;
	User.findByIdAndUpdate(userId, { imageUrl: req.file.path }, { new: true })
		.then(() => {
			res.redirect(`/profile/${username}`);
		})
		.catch((err) => {
			console.log(err);
			next(err);
		});
});
