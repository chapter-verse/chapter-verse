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
			const currentUser = req.session.currentUser.username;
			const userData = await User.findOne({ currentUser }).populate('collections');
			const books = response.data.items;
			res.render('books-list', { books, userData });
		} else {
			res.render('books-list');
		}
	})
	.post((req, res) => {});

router
	.route('/add')
	.get((req, res) => {})
	.post(async (req, res) => {
		console.log(req.body);
		// const currentUser = req.session.currentUser.username;
		// const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${req.params.bookId}`, {
		// 	headers: {
		// 		'Referrer-Policy': 'no-referrer-when-downgrade',
		// 	},
		// });
		// const book = response.data;
		// const bookId = book.id;
		// const user = await User.findOne({ currentUser }).populate('collections');
		// const collection = user.collections.find((collection) => collection.name === name);
		// collection.books.push(bookId);
		// await collection.save();
		// await user.save();
		// res.redirect(`/books/${bookId}`);
	});

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
		const { name } = req.body;
		const currentUser = req.session.currentUser.username;
		const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${req.params.bookId}`, {
			headers: {
				'Referrer-Policy': 'no-referrer-when-downgrade',
			},
		});
		const book = response.data;
		const bookId = book.id;
		const user = await User.findOne({ currentUser }).populate('collections');
		const collection = user.collections.find((collection) => collection.name === name);
		collection.books.push(bookId);
		await collection.save();
		await user.save();
		res.redirect(`/books/${bookId}`);
	});

module.exports = router;
