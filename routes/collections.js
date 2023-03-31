const router = require('express').Router();
const User = require('../models/User.model');
const Collection = require('../models/Collection.model');
const axios = require('axios');
const fileUploader = require('../config/cloudinary.config');

router.get('/collection-list', (req, res, next) => {
	Collection.find()
		.populate('user')
		.then((data) => {
			res.render('collection-list', { data: data });
		})
		.catch((err) => {
			console.log(err);
			next(err);
		});
});

router.post('/create', async (req, res) => {
	try {
		const { name, description } = req.body;
		const currentUser = req.session.currentUser.username;
		const user = await User.findOne({ username: currentUser });
		const collection = await Collection.create({
			name,
			description,
			user: req.session.currentUser,
		});
		user.collections.push(collection);
		await user.save();
		await collection.save();
		res.redirect(`/profile/${currentUser}`);
	} catch (err) {
		console.log(err);
	}
});

router.get('/:collectionsId', async (req, res) => {
	let verificationObject = {};
	const { currentUser } = req.session;
	const { collectionsId } = req.params;

	await Collection.findById(collectionsId)
		.populate('books')
		.then((collection) => {
			const user = collection.user;
			return User.findById(user).then((person) => {
				if (person.username === currentUser.username) {
					verificationObject.property = 'Verified!';
				}

				return Promise.all(
					collection.books.map((book) => {
						return axios
							.get(`https://www.googleapis.com/books/v1/volumes/${book}`, {
								headers: {
									'Referrer-Policy': 'no-referrer-when-downgrade',
								},
							})
							.then((response) => response.data);
					}),
				).then((bookData) => {
					res.render('collection', { collection, books: bookData, verificationObject });
				});
			});
		})
		.catch((error) => {
			console.error(error);
		});
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
    console.log(collectionsId)
	Collection.findByIdAndUpdate(collectionsId, { imageUrl: req.file.path }, { new: true })
		.then(() => {
			res.redirect(`/collections/${collectionsId}`);
		})
		.catch((err) => {
			console.log(err);
			next(err);
		});
});

router.post('/:collectionsId/delete', async (req, res, next) => {
	try {
		const { collectionsId } = req.params;
		const currentUser = req.session.currentUser.username;
		const user = await User.findOne({ username: currentUser }).populate('collections');
		user.collections.pull(collectionsId);
		await user.save();
		await Collection.findByIdAndDelete(collectionsId);
		res.redirect(`/profile/${currentUser}`);
	} catch (err) {
		console.log(err);
		next(err);
	}
});

module.exports = router;
