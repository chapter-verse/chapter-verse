const express = require('express');
const router = express.Router();
const axios = require('axios');
const Collection = require('../models/Collection.model');
const User = require('../models/User.model');

router
	.route('/')
	.get(async (req, res) => {
		if (req.query.search) {
			const response = await axios.get(
				`https://www.googleapis.com/books/v1/volumes?q=${req.query.search}&filter=partial&maxResults=40&key=${process.env.KEY}`,
				{
					headers: {
						'Referrer-Policy': 'no-referrer-when-downgrade',
					},
				},
			);
			const books = response.data.items;
			res.render('index', { books });
		} else {
			res.render('index');
		}
	})
	.post((req, res) => {});

router
	.route('/:bookId')
	.get(async (req, res) => {
		const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${req.params.bookId}`, {
			headers: {
				'Referrer-Policy': 'no-referrer-when-downgrade',
			},
		});
		const currentUser = req.session.currentUser.username;
		const userData = await User.findOne({ currentUser }).populate('collections');
		const book = response.data;
		res.render('book', { book, userData });
	})
	.post((req, res) => {});

router
	.route('/:bookId/add')
	.get((req, res) => {})
	.post(async (req, res) => {
		const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${req.params.bookId}`, {
			headers: {
				'Referrer-Policy': 'no-referrer-when-downgrade',
			},
		});
		const book = response.data.id;
		const { name } = req.body;
		console.log(name);
		const currentUser = req.session.currentUser.username;
		const user = await User.findOne({ currentUser }).populate('collections');
		const collectionTarget = user.collections.find((collection) => collection.name === name);
		console.log(collectionTarget);
		// await user.save();
		// res.redirect(`/books/${book}`);
	});

module.exports = router;
