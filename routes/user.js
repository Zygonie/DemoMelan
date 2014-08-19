var passport = require('passport');

/*
 * Login - show the login form
 */
exports.loginGET = function(req, res) {
    // render the page and pass in any flash data if it exists
	res.render('login', { message: req.flash('loginMessage') });
};

/*
 * process the login form
 */
exports.loginPOST = passport.authenticate('local-login', {
	successRedirect : '/home', // redirect to the secure profile section
	failureRedirect : '/login', // redirect back to the signup page if there is an error
	failureFlash : true // allow flash messages
});

/*
 * Signup - show the signup form
 */
exports.signupGET = function(req, res) {
	// render the page and pass in any flash data if it exists
	res.render('signup', { message: req.flash('signupMessage') });
};

/*
 * process the signup form
 */
exports.signupPOST = passport.authenticate('local-signup', {
	successRedirect : '/home', // redirect to the secure profile section
	failureRedirect : '/signup', // redirect back to the signup page if there is an error
	failureFlash : true // allow flash messages
});

/*
 * Logout
 */
exports.logout = function(req, res) {
	req.logout();
	res.redirect('/');
};