const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', (req, res, next) => {
	const options = {
		method: 'GET',
		url: 'https://api.myanimelist.net/v2/anime/10357?fields=rank,mean,alternative_titles',
		headers: {
			'X-MAL-CLIENT-ID': '2219547a216caad76b4dcdcc1703f964',
		},
	};

	axios
		.request(options)
		.then((response) => {
			console.log(response.data);
			res.render('index', response);
		})
		.catch((error) => {
			console.error(error);
		});
});

module.exports = router;
