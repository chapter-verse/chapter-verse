const router = require('express').Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');

router.get('/:username', (req, res) => {
	const { username } = req.params;
	User.findOne({ username })
		.then((data) => res.render('profile', data))
		.catch((err) => console.log(err));
});

module.exports = router;

router.get('/:userId/edit', (req, res, next) => {
	const {userId} = req.params;
	// console.log(req)
	User.findById(userId)
	.then((data) => {res.render('edit-profile', data)
		console.log(data)
})
	.catch((err) => {
		console.log(err)
		next(err)
	});
});

router.post('/:userId/edit', (req, res, next) => {
	console.log(req.params)
	console.log(req.body)
	console.log(req.session)
	const {userId} = req.params;
	const { username, description, birthday } = req.body;
  
	User.findByIdAndUpdate(userId, {username, description, birthday}, { new: true })
	  .then(() => {
		res.redirect(`/profile/${username}`); 
	  })
	  .catch((err) => {
		console.log(err)
		next(err)
	});
  });


