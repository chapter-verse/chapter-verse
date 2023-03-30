const express = require('express');
const router = express.Router();
const axios = require('axios');
const Collection = require('../models/Collection.model');
const User = require('../models/User.model');
const isLoggedIn = require('../middleware/isLoggedIn');

router
	.route('/')
	.get(async (req, res) => {
		if (req.session.currentUser) {
			const currentUser = req.session.currentUser.username;
			const userData = await User.findOne({ currentUser }).populate('collections');
			const collections = userData.collections;
			const bookData = collections
				.map((collection) => {
					const books = collection.books.map((book) => {
						return book;
					});
					return books;
				})
				.flat();

			const response = await axios.get(`http://openlibrary.org/search.json?q=${req.query.search}`, {
				headers: {
					'Referrer-Policy': 'no-referrer-when-downgrade',
				},
			});
			res.json(response.data.docs);
		} else {
			const response = await axios.get(`http://openlibrary.org/search.json?q=${req.query.search}`, {
				headers: {
					'Referrer-Policy': 'no-referrer-when-downgrade',
				},
			});
			const books = response.data.items;
			res.render('books-list', { books });
		}
	})
	.post((req, res) => {});

router
	.route('/add')
	.get((req, res) => {})
	.post(isLoggedIn, async (req, res) => {
		try {
			const { name, bookId } = req.body;
			const currentUser = req.session.currentUser.username;
			await axios.get(`http://openlibrary.org/search.json?q=${bookId}`, {
				headers: {
					'Referrer-Policy': 'no-referrer-when-downgrade',
				},
			});
			const user = await User.findOne({ currentUser }).populate('collections');
			const collection = user.collections.find((collection) => collection.name === name);
			collection.books.push(bookId);
			await collection.save();
			await user.save();
			res.redirect(`/books/${bookId}`);
		} catch (err) {
			console.log(err);
		}
	});

router
	.route('/:bookId')
	.get(async (req, res) => {
		const response = await axios.get(`http://openlibrary.org/search.json?q=${req.params.bookId}`, {
			headers: {
				'Referrer-Policy': 'no-referrer-when-downgrade',
			},
		});
		if (req.session.currentUser) {
			const currentUser = req.session.currentUser.username;
			const userData = await User.findOne({ currentUser }).populate('collections');
			const book = response.data;
			res.render('book', { book, userData });
		} else {
			const book = response.data;
			res.render('book', { book });
		}
	})
	.post((req, res) => {});

router
	.route('/:bookId/add')
	.get((req, res) => {})
	.post(isLoggedIn, async (req, res) => {
		const { name } = req.body;
		const currentUser = req.session.currentUser.username;
		const response = await axios.get(`http://openlibrary.org/search.json?q=${req.params.bookId}`, {
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
