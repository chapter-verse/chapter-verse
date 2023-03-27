const express = require('express');
const router = express.Router();
const axios = require('axios');

router
	.route('/')
	.get((req, res) => res.render('index'))
	.post((req, res) => {});

module.exports = router;
