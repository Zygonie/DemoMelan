/*
 * GET home page.
 */
var Client= require('../config/models/client');

exports.index = function(req, res){
  res.render('index');
};

exports.home = function(req, res){
  res.render('home');
};
	
exports.client = function(req, res){
  if(req.params.clientID)
	  res.render('clientDetails');
  else
	  res.render('client');
};

exports.clientDetails = function(req, res){
  res.render('clientDetails');
};

exports.interventions = function(req, res){
  res.render('interventions');
};

exports.logout = function(req, res) {
  var name = req.user.username;
  req.logout();
  console.log('User ' + name + ' has logged out.');
  res.redirect('index');
};