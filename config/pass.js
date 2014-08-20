
var passport = require('passport'),
    mongoose = require('mongoose'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('./models/user');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    //usernameField : 'email',
    //passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) {
        return done(err);
      }
      //check to see if there's already a user with that username
      if (user) {
        return done(null, false, req.flash('signupMessage', "Ce nom d'usager est déjà pris"));
      }
      else {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (err) {
            return done(err);
          }
          //check to see if there's already a user with that email
          if (user) {
            return done(null, false, req.flash('signupMessage', 'Cet email est déjà utilisé par un autre utilisateur'));
          }
          else {
            // if there is no user with that email
            // create the user
            var newUser = new User();

            // set the user's local credentials
            newUser.username = username;
            newUser.email = req.body.email;
            newUser.password = newUser.generateHash(password);

            // save the user
            newUser.save(function(err) {
              if (err) {
                throw err;
              }
              return done(null, newUser);
            });
          }
        });
      }
   });
}));

passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    //usernameField : 'email',
    //passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, username, password, done) { // callback with email and password from our form
    User.findOne({ 'username' :  username }, function(err, user) {
        // if there are any errors, return the error before anything else
        if (err){
            return done(err);
        }
        // if no user is found, return the message
        if (!user){
            return done(null, false, req.flash('loginMessage', 'User not found.')); // req.flash is the way to set flashdata using connect-flash
        }
		// if the user is found but the password is wrong
        if (!user.validPassword(password)){
            return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
        }
        // all is well, return successful user
        return done(null, user);
    });

}));

// Simple route middleware to ensure user is authenticated.  Otherwise send to login page.
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
};