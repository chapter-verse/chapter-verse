const router = require('express').Router();
const User = require('../models/User.model');
const Collection = require('../models/Collection.model');
const session = require('express-session');
const bcrypt = require('bcrypt');
const axios = require('axios');

router
	.route('/create')
	.get((req, res) => {})
	.post(async (req, res) => {
		try {
			const { name, description } = req.body;
			const currentUser = req.session.currentUser.username;
			const user = await User.findOne({ currentUser });
			const collection = await Collection.create({
				name,
				description,
				user: req.session.currentUser,
			});
			user.collections.push(collection);
			await collection.save();
			await user.save();
		} catch (err) {
			console.log(err);
		}
	});

module.exports = router;
