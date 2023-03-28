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
			res.redirect(`/profile/${currentUser}`);
		} catch (err) {
			console.log(err);
		}
	});

router.get('/:collectionsId', (req, res) => {
    const { collectionsId } = req.params;
    Collection.findById(collectionsId)
        .populate('books')
        .then((data) => res.render('collection', data))
        .catch((err) => console.log(err));
});


router.post('/:collectionsId/edit', (req, res, next) => {
    const { collectionsId } = req.params;
    const { name, description } = req.body;

    User.findByIdAndUpdate(collectionsId, { name, description },)
        .then(() => {
            res.redirect(`/collections/${collectionsId}`);
        })
        .catch((err) => {
            console.log(err);
            next(err);
        });
});

router.get('/:collectionsId/delete', (req, res, next) => {
    const { collectionsId } = req.params;
    const { name, description } = req.body;

    User.findByIdAndDelete(collectionsId, { name, description },)
        .then(() => {
            res.redirect(`/collections/${collectionsId}`);
        })
        .catch((err) => {
            console.log(err);
            next(err);
        });
});

module.exports = router;
