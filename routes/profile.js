const router = require('express').Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => res.render('profile'));

module.exports = router;
