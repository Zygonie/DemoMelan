/*
 * API interventions
 */
var mongoose = require('mongoose'),
    passport = require('passport'),
    Intervention = require('../config/models/intervention'),
    InterventionType = require('../config/models/interventionTypes');

exports.getInterventions = function(req, res){
  var id = req.query.client;
  Intervention.find({client: id})
              .populate('type client')
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
        console.log('Error updating intervention of type ' + intervention.type.name + ' with message: ' + err);
        res.status(500).send({ error: err.toString() });
      }
      else {
        Intervention.populate(result, {path:'type client'}, function(err,returnedIntervention){
            if(err) {
              console.log(err);
              res.status(500).send({ error: err.toString() });
            }
            else {
              console.log('Intervention of type ' + returnedIntervention.type.name + " for client " + returnedIntervention.client.forename + ' ' +
                      returnedIntervention.client.name + " has been updated.");
              res.json(returnedIntervention);
            }
        });
      }
    });
  }
  else{
    var newIntervention = new Intervention(intervention);
    newIntervention.save(function(err, result) {
      if(err) {
        console.log(err);
        res.status(500).send({ error: err.toString() });
      }
      else {
        Intervention.populate(result, {path:'type client'}, function(err,returnedIntervention){
          if(err) {
            console.log(err);
            res.status(500).send({ error: err.toString() });
          }
          else {
            console.log('New intervention ' + returnedIntervention.type.name + " for client " + returnedIntervention.client.forename + ' ' +
                    returnedIntervention.client.name + " has been created.");
            res.json(returnedIntervention);
          }
        });
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