const express = require('express');
const router = express.Router();

router
	.route('/')
	.get((req, res) => res.render('index'))
	.post((req, res) => {});


router.get('/test', (req, res, next) => res.render('edit-profile'))


module.exports = router;
