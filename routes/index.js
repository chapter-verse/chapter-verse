const express = require('express');
const router = express.Router();
const axios = require('axios');

router
	.route('/')
	.get((req, res) => {
		const options = {
			method: 'GET',
			url: 'https://api.myanimelist.net/v2/anime/10357?fields=rank,mean,alternative_titles',
			headers: {
				'X-MAL-CLIENT-ID': '2219547a216caad76b4dcdcc1703f964',
			},
		};

		axios
			.request(options)
			.then((response) => res.render('index', response))
			.catch((error) => console.error(error));
	})
	.post((req, res) => {});

module.exports = router;
