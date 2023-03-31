const express = require('express');
const router = express.Router();
const axios = require('axios');
const Collection = require('../models/Collection.model');
const User = require('../models/User.model');
const isLoggedIn = require('../middleware/isLoggedIn');

router.get('/', async (req, res) => {
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
});

router.post('/add', async (req, res) => {
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

// FEEL FREE TO UNCOMMENT THIS, I REWROTE IT BELOW WITH ASYNC JUST TO SHOW YOU HOW CLEANER IT LOOKS :D

// router.get('/:bookId', (req, res) => {
// 	axios
// 		.get(`https://www.googleapis.com/books/v1/volumes/${req.params.bookId}`, {
// 			headers: {
// 				'Referrer-Policy': 'no-referrer-when-downgrade',
// 			},
// 		})
// 		.then((response) => {
// 			if (req.session.currentUser) {
// 				const { bookId } = req.params;
// 				const currentUserId = req.session.currentUser._id;
// 				console.log(currentUserId);
// 				let favourite = false;
// 				let favouritesArr;
// 				User.findById(currentUserId)
// 					.populate('collections')
// 					.populate('favourites')
// 					.then((data) => {
// 						favouritesArr = data.favourites;
// 						if (favouritesArr.includes(bookId)) favourite = true;
// 						const book = response.data;
// 						res.render('book', { book, data, favourite });
// 					});
// 			} else {
// 				const book = response.data;
// 				res.render('book', { book });
// 			}
// 		})
// 		.catch((error) => {
// 			console.error(error);
// 			res.status(500).send('An error occurred');
// 		});
// })

router.get('/:bookId', async (req, res) => {
	try {
		const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${req.params.bookId}`, {
			headers: {
				'Referrer-Policy': 'no-referrer-when-downgrade',
			},
		});

		const book = response.data;
		let favourite = false;
		let data = null;

		if (req.session.currentUser) {
			const currentUserId = req.session.currentUser._id;
			data = await User.findById(currentUserId).populate('collections').populate('favourites');
			favourite = data.favourites.includes(req.params.bookId);
		}

		res.render('book', { book, data, favourite });
	} catch (error) {
		console.error(error);
		res.status(500).send('An error occurred');
	}
});

router.post('/:bookId/add', async (req, res) => {
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
	const { referer } = req.headers;
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
