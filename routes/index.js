const express = require('express');
const router = express.Router();
const axios = require('axios');
const { GoogleBooksAPI } = require('google-books-js');
const googleBooksApi = new GoogleBooksAPI();

router
	.route('/')
	.get(async (req, res) => {
		try {
			const response = await axios.get('https://www.googleapis.com/books/v1/volumes?q=isbn:0747532699');
			const data = response.data.items[0].volumeInfo;
			res.render('index', data);
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	})
	.post((req, res) => {});

async function fetchBooks() {
	const books = await googleBooksApi.search({
		filters: {
			title: 'Fire and Blood',
		},
	});

	console.log(books.items[0].volumeInfo.title);
	console.log(books.items[0].volumeInfo.subtitle);
	console.log(books.items[0].volumeInfo.authors);
}

fetchBooks();

module.exports = router;
