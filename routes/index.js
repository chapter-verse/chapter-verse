const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User.model');

router
	.route('/')
	.get(async (req, res) => {
		if (req.session.currentUser) {
			const currentUser = req.session.currentUser.username;
			const userData = await User.findOne({ currentUser }).populate('collections');

			res.render('index', { userData });
		} else {
			res.render('index', { userData });
		}
	})
	.post((req, res) => {});

function getRandomQueries(count) {
	const queries = [
		'adventure',
		'biography',
		'classics',
		'comics',
		'cookbooks',
		'crime',
		'drama',
		'fantasy',
		'history',
		'horror',
		'humor',
		'memoir',
		'poetry',
		'psychology',
		'science',
		'self-help',
		'spirituality',
		'thriller',
		'travel',
		'young adult',
		'fiction',
		'non-fiction',
		'mystery',
		'romance',
		'science fiction',
	];
	if (count > queries.length) {
		throw new Error(`Cannot get more than ${queries.length} queries`);
	}
	const selectedQueries = new Set();
	while (selectedQueries.size < count) {
		const index = Math.floor(Math.random() * queries.length);
		selectedQueries.add(queries[index]);
	}
	return Array.from(selectedQueries);
}

const randomNumber = Math.floor(Math.random() * 50) + 1;

module.exports = router;
