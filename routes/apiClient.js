/*
 * API client
 */
var mongoose = require('mongoose'),
    passport = require('passport'),
    Client= require('../config/models/client');

exports.getClient = function(req,res) {
	var name = req.query.nom,
        forename = req.query.prenom,
        phone = req.query.phone,
        id = req.query.clientID;
	if(!name && !forename && !phone && !id) {
		res.json([]);
	}
	else {
      if(id){
        Client.findById(id, function(err, client){
          res.json(client);
        });
      }
      else{
        var query = {};
        if(name){ query.name = new RegExp('^'+ name +'.*$', "i"); }
        if(forename){ query.forename = new RegExp('^'+ forename +'.*$', "i"); }
        if(phone){ query.phone = phone; }
        Client.find(query, function(err, clients){
          res.json(clients);
        });
      }
	}
};

exports.createClient = function(req, res) {
	var client = new Client({
		name: req.body.name,
        forename: req.body.forename,
        phone: req.body.phone,
        assMaladie: req.body.assMaladie,
        assureur: req.body.assureur
	});
	client.save(function(err) {
        if(err) {
			console.log(err);
		}
		else {
			console.log('New client ' + client.forename + " " + client.name + " has been created.");
			res.send(JSON.stringify(client));
		}
	});
};

exports.removeClient = function(req,res) {
	var clientId = req.params.clientId;
	Client.findByIdAndRemove(clientId, function(err, client) {
		if (err) {
			console.log('An error hase occured while trying to delete client with Id: ' + clientId);
		}
		else {
			console.log('Client with Id ' + clientId + ' has well been removed from DB');
			res.send(JSON.stringify(client));
		}
	});
};

exports.updateClient = function(req, res) {
	var client = req.body;
	delete client._id;
	Client.update({'username':client.username},client,{safe:true}, function(err, result){
		if(err) {
			console.log('Error updating client. ' + err);
			res.redirect('/client');
		}
		else{
			console.log('' + result + ' client ' + client.username + ' updated for user: ');
			res.redirect('/client');
		}
	});
};











