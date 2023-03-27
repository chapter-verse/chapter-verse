const router = require('express').Router();
const User = require('../models/User.model');
const Collection = require('../models/Collection.model');
const session = require('express-session');
const bcrypt = require('bcrypt');

router.get('/create', (req, res, next) => {
    console.log(req.session)
    const {username} = req.session.currentUser;
    console.log(username)
    User.findOne({username})
	.then((data) => {res.render('create-collection', data)
})
	.catch((err) => {
		console.log(err)
		next(err)
	});
});

router.post('/create', (req, res, next) => {
	const {userId} = req.session.currentUser;
	const {name, description} = req.body;
  
	Collection.create({name, description, userId})
	  .then(() => {
		res.redirect(`/profile/${username}`); 
	  })
	  .catch((err) => {
		console.log(err)
		next(err)
	});
  });



module.exports = router;