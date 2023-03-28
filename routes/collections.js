const router = require('express').Router();
const User = require('../models/User.model');
const Collection = require('../models/Collection.model');
const session = require('express-session');
const bcrypt = require('bcrypt');
const axios = require('axios');

router
	.route('/create')
	.get((req, res) => {})
	.post(async (req, res) => {
		try {
			const { name, description } = req.body;
			console.log(req.body);
			const currentUser = req.session.currentUser.username;
			const user = await User.findOne({ currentUser });
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

router.get('/:collectionsId', (req, res) => {
	const { collectionsId } = req.params;
	Collection.findById(collectionsId)
		.populate('books')
		.then((data) => {
			if (data) {
				res.render('collection', data);
			} else {
				throw new Error('No data found');
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).send('An error occurred');
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
