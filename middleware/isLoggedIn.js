module.exports = (req, res, next) => {
	if (req.session.currentUser) {
		next();
	}
	return res.redirect('/login');
};
