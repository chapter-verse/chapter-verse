const express = require('express');
const router = express.Router();
const axios = require('axios');
const Collection = require('../models/Collection.model');

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
		const book = response.data;
		res.render('book', { book });
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
		const { name, description } = req.body;
		const book = response.data.id;
		const collection = await Collection.create({
			name,
			description,
			user: req.session.currentUser,
		});
		collection.books.push(book);
		await collection.save();
	});

module.exports = router;
