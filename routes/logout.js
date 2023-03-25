const router = require('express').Router();

router.post('/', (req, res, next) => {
	req.session.destroy((err) => {
		if (err) {
			next(err);
		}
		res.redirect('/');
	});
});

module.exports = router;
