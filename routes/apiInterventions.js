/*
 * API interventions
 */
var mongoose = require('mongoose'),
    passport = require('passport'),
    Intervention = require('../config/models/intervention'),
    InterventionType = require('../config/models/interventionTypes');

exports.getInterventions = function(req, res){
  var id = req.query.clientID;
  Intervention.find({clientID: id})
              .populate('type')
              .exec(function(err, interventions){
                res.json(interventions);
              });
};

exports.saveIntervention = function(req, res) {
  var interventionId = req.query.Id;
  var intervention = req.body;
	
  if(interventionId){
    delete intervention._id;
    Intervention.findByIdAndUpdate(interventionId, intervention, {safe:true}, function(err, result){
      if(err) {
        console.log('Error updating intervention of type ' + intervention.type + ' with message: ' + err);
        res.status(500).send({ error: err.toString() });
      }
      else {
        console.log('Intervention of type ' + intervention.type + ' updated');
        res.json(intervention);
      }
    });
  }
  else{
    var newIntervention = new Intervention(intervention);
    newIntervention.save(function(err) {
      if(err) {
        console.log(err);
        res.status(500).send({ error: err.toString() });
      }
      else {
		console.log('New intervention ' + intervention.type + " for client " + intervention.clientID + " has been created.");
		res.json(intervention);
      }
    });
  }
};


exports.removeIntervention = function(req, res) {
  var interventionID = req.query.Id;
  Intervention.findByIdAndRemove(interventionID, function(err, intervention) {
    if (err) {
      console.log('An error hase occured while trying to delete intervention with Id: ' + interventionID);
      res.status(500).send({ error: err.toString() });
    }
    else {
      console.log('Intervention with Id ' + interventionID + ' has well been removed from DB');
      res.json(intervention);
    }
  });
};