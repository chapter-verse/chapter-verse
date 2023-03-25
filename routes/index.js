const express = require('express');
const router = express.Router();
const axios = require('axios');
const { GoogleBooksAPI } = require('google-books-js');
const googleBooksApi = new GoogleBooksAPI();

router
	.route('/')
	.get(async (req, res) => {
		try {
			const books = await fetchBooks();
			console.log(books.items.length);
			res.render('index', { books });
		} catch (err) {
			console.log(err.message);
		}
	})
	.post((req, res) => {});

async function fetchBooks(value) {
	const books = await googleBooksApi.search({
		filters: {
			title: value || ' ',
			author: value || ' ',
			subject: value || ' ',
		},
	});

	return books;
}

module.exports = router;
