const router = require('express').Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const fileUploader = require('../config/cloudinary.config');

router.get('/user-list', (req, res, next) => {
	User.find()
	.then((data)=> {
		res.render('user-list', {data: data});
	})
	.catch((err) => {
		console.log(err);
		next(err);
	});
});

router.get('/:username', (req, res) => {
	const { username } = req.params;
	const currentUser = req.session.currentUser.username;
	const currentId = req.session.currentUser._id;
	if (username === currentUser) {
		User.findOne({ username })
		.populate('collections')
		.populate('favourites')
		.populate('follows')
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
		let follow = false;
		let followsArr;
		User.findById(currentId)
			.populate('follows')
			.then((data) => {
				return followsArr = data.follows.map((follow) => follow._id.toString())
			})
		User.findOne({ username })
			.populate('collections')
			.populate('favourites')
			.populate('follows')
			.then((data) => {
				const userId = data._id;
				const userIdString = userId.toString();
				if (followsArr.includes(userIdString)) follow = true ;
				let booksNb = 0;
				let { collections } = data;
				collections.forEach((element) => {
					let { books } = element;
					booksNb += books.length;
				});
				res.render('profile', { data, booksNb, follow });
			})
			.catch((err) => console.log(err));
	}
});

router.post('/:userId/edit', (req, res, next) => {
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

router.post('/:userId/follow', (req, res, next) => {
	const { userId } = req.params;
	const currentUserId = req.session.currentUser._id;
	const {referer} = req.headers;
	const lastSlashIndex = referer.lastIndexOf('/');
	const username = referer.substring(lastSlashIndex + 1);
	User.findById(userId)
	.then((follow)=> {
	return User.findByIdAndUpdate(currentUserId, { $addToSet: { follows: follow._id } }, { new: true });
	})
	.then(() => {
		res.redirect(`/profile/${username}`);
	})
	.catch((err) => {
		console.log(err);
		next(err);
	});
});

router.post('/:userId/unfollow', (req, res, next) => {
	const { userId } = req.params;
	const currentUserId = req.session.currentUser._id;
	const {referer} = req.headers;
	const lastSlashIndex = referer.lastIndexOf('/');
	const username = referer.substring(lastSlashIndex + 1);
	User.findById(userId)
	.then((follow)=> {
	return User.findByIdAndUpdate(currentUserId, { $pull: { follows: follow._id } }, { new: true });
	})
	.then(() => {
		res.redirect(`/profile/${username}`);
	})
	.catch((err) => {
		console.log(err);
		next(err);
	});
});

router.post('/:bookId/favourite', (req, res, next) => {
	const { bookId } = req.params;
	const userId = req.session.currentUser._id;
	User.findById(userId)
	.then(()=> {
	return User.findByIdAndUpdate(userId, { $addToSet: { favourites: bookId } }, { new: true });
	})
	.then(() => {
		res.redirect(`/books/${bookId}`);
	})
	.catch((err) => {
		console.log(err);
		next(err);
	});
});

router.post('/:bookId/unfavourite', (req, res, next) => {
	const { bookId } = req.params;
	const userId = req.session.currentUser._id;
	User.findById(userId)
	.then(()=> {
	return User.findByIdAndUpdate(currentUserId, { $pull: { favourites: bookId  } }, { new: true });
	})
	.then(() => {
		res.redirect(`/books/${bookId}`);
	})
	.catch((err) => {
		console.log(err);
		next(err);
	});
});

// router.post('/:bookId/unfavouritePP', (req, res, next) => {
// 	const { bookId } = req.params;
// 	const userId = req.session.currentUser._id;
// 	const {username} = req.session.currentUser;
// 	User.findById(userId)
// 	.then(()=> {
// 	return User.findByIdAndUpdate(currentUserId, { $pull: { favourites: bookId  } }, { new: true });
// 	})
// 	.then(() => {
// 		res.redirect(`/profile/${username}`);
// 	})
// 	.catch((err) => {
// 		console.log(err);
// 		next(err);
// 	});
// });

module.exports = router;