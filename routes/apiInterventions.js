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
    Intervention.update({'username':intervention.username},intervention,{safe:true}, function(err, result){
      if(err) {
        console.log('Error updating client. ' + err);
        res.json(intervention);
      }
      else{
        console.log('Intervention of type ' + intervention.type+ ' updated for client ' + intervention.clientID);
        res.json(intervention);
      }
    });
  }
  else{
    var newIntervention = new Intervention(intervention);
    newIntervention.save(function(err) {
      if(err) {
        console.log(err);
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
    }
    else {
      console.log('Intervention with Id ' + interventionID + ' has well been removed from DB');
      res.json(intervention);
    }
  });
};

/*
 * Intervention types
 */
exports.getInterventionTypes = function(req, res){
  InterventionType.find().exec(function(err, typesFound) {
    res.json(typesFound);
  });
};

exports.saveInterventionType = function(req, res) {
  var interventionTypeId = req.query.Id;
  var interventionType = req.body;
		
  if(interventionTypeId){
    delete interventionType._id;
    Intervention.findByIdAndUpdate(interventionTypeId, interventionType, {safe:true}, function(err, result){
      if(err) {
        console.log('Error updating intervention type ' + interventionType.name + ' with message: ' + err);
        res.json(interventionType);
      }
      else {
        console.log('Intervention type ' + interventionType.name + ' updated');
       res.json(interventionType);
      }
    });
  }
  else{
    var newInterventionType = new Intervention(interventionType);
    newInterventionType.save(function(err) {
      if(err) {
        console.log(err);
      }
      else {
        console.log('New intervention ' + interventionType.type + " for client " + interventionType.clientID + " has been created.");
        res.json(interventionType);
      }
    });
  }
};

 exports.removeInterventionType = function(req, res) {
  var interventionTypeID = req.query.Id;
  InterventionType.findByIdAndRemove(interventionTypeID, function(err, interventionType) {
    if (err) {
      console.log('An error hase occured while trying to delete intervention type with Id: ' + interventionTypeID);
    }
    else {
      console.log('Intervention type with Id ' + interventionTypeID + ' has well been removed from DB');
      res.json(interventionType);
    }
  });
 };