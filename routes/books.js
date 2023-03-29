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

			const response = await axios.get(
				`https://www.googleapis.com/books/v1/volumes?q=${req.query.search}&filter=partial&maxResults=40&key=${process.env.KEY}`,
				{
					headers: {
						'Referrer-Policy': 'no-referrer-when-downgrade',
					},
				},
			);
			const books = response.data.items;
			res.render('books-list', { books, userData, bookData });
		} else {
			const response = await axios.get(
				`https://www.googleapis.com/books/v1/volumes?q=${req.query.search}&filter=partial&maxResults=40&key=${process.env.KEY}`,
				{
					headers: {
						'Referrer-Policy': 'no-referrer-when-downgrade',
					},
				},
			);
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
			await axios.get(`https://www.googleapis.com/books/v1/volumes/${bookId}`, {
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
		const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${req.params.bookId}`, {
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

router.post('/:bookId/delete', (req, res, next) => {
	const { bookId } = req.params;
	const {referer} = req.headers;
	const lastSlashIndex = referer.lastIndexOf('/');
	const collectionId = referer.substring(lastSlashIndex + 1);
	Collection.findByIdAndUpdate(collectionId, { $pull: { books: bookId } })
	.then(() => {
		res.redirect(`/collections/${collectionId}`);
	})
	.catch((err) => {
		console.log(err);
		next(err);
		});
});

module.exports = router;
