const express = require('express');
const router = express.Router();
const axios = require('axios');

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

module.exports = router;
