const router = require('express').Router();
const User = require('../models/User.model');
const Collection = require('../models/Collection.model');
const session = require('express-session');
const bcrypt = require('bcrypt');
const axios = require('axios');
const fileUploader = require('../config/cloudinary.config');

// router
// 	.route('/create')
// 	.get((req, res) => {})
// 	.post(async (req, res) => {
// 		try {
// 			const { name, description } = req.body;
// 			console.log(req.body);
// 			const currentUser = req.session.currentUser.username;
// 			const user = await User.findOne({ currentUser });
// 			const collection = await Collection.create({
// 				name,
// 				description,
// 				user: req.session.currentUser,
// 			});
// 			user.collections.push(collection);
// 			await user.save();
// 			await collection.save();
// 			res.redirect(`/profile/${currentUser}`);
// 		} catch (err) {
// 			console.log(err);
// 		}
// 	});

router.post('/create', fileUploader.single('cover'), (req, res, next) => {
	console.log(req);
	const { username } = req.session.currentUser;
	const { name, description } = req.body;
	Collection.create({ name, description, user: req.session.currentUser, imageUrl: req.file.path }, { new: true })
		.then(() => {
			// User.findOne(username)
			// .then(() => {
			//     user.collections.push(collection);
			res.redirect(`/profile/${currentUser}`);
			// });
		})
		.catch((err) => {
			console.log(err);
			next(err);
		});
});

router.get('/:collectionsId', async (req, res) => {
	try {
		const { collectionsId } = req.params;
		const collection = await Collection.findById(collectionsId).populate('books');
		const bookData = await Promise.all(
			collection.books.map(async (book) => {
				const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${book}`, {
					headers: {
						'Referrer-Policy': 'no-referrer-when-downgrade',
					},
				});
				return response.data;
			}),
		);
		res.render('collection', { collection, books: bookData });
	} catch (error) {
		console.error(error);
	}
});

router.post('/:collectionsId/edit', (req, res, next) => {
	const { collectionsId } = req.params;
	const { name, description } = req.body;

	Collection.findByIdAndUpdate(collectionsId, { name, description }, { new: true })
		.then(() => {
			res.redirect(`/collections/${collectionsId}`);
		})
		.catch((err) => {
			console.log(err);
			next(err);
		});
});

router.post('/:collectionsId/edit-cover', fileUploader.single('cover'), (req, res, next) => {
	const { collectionsId } = req.params;
	Collection.findByIdAndUpdate(collectionsId, { imageUrl: req.file.path }, { new: true })
		.then(() => {
			res.redirect(`/collections/${collectionsId}`);
		})
		.catch((err) => {
			console.log(err);
			next(err);
		});
});

router.get('/:collectionsId/delete', (req, res, next) => {
	const { collectionsId } = req.params;
	const currentUser = req.session.currentUser.username;
	Collection.findByIdAndDelete(collectionsId)
		.then(() => {
			res.redirect(`/profile/${currentUser}`);
		})
		.catch((err) => {
			console.log(err);
			next(err);
		});
});

module.exports = router;
