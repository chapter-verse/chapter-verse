const express = require('express');
const router = express.Router();
const axios = require('axios');

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

module.exports = router;
