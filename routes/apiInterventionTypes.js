/*
 * API interventionTypes
 */
var mongoose = require('mongoose'),
    passport = require('passport'),
    InterventionType = require('../config/models/interventionTypes');

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
    InterventionType.findByIdAndUpdate(interventionTypeId, interventionType, {safe:true}, function(err, result){
      if(err) {
        console.log('Error updating intervention type ' + interventionType.name + ' with message: ' + err);
        res.status(500).send({ error: err.toString() });
      }
      else {
        console.log('Intervention type ' + interventionType.name + ' updated');
        res.json(result);
      }
    });
  }
  else{
    var newInterventionType = new InterventionType(interventionType);
    newInterventionType.save(function(err, result) {
      if(err) {
        console.log(err);
        res.status(500).send({ error: err.toString() });
      }
      else {
        console.log('New intervention ' + result.type.name + " for client " + result.client.forename + ' ' + result.client.name + " has been created.");
        res.json(result);
      }
    });
  }
};

 exports.removeInterventionType = function(req, res) {
  var interventionTypeID = req.query.Id;
  InterventionType.findByIdAndRemove(interventionTypeID, function(err, interventionType) {
    if (err) {
      console.log('An error hase occured while trying to delete intervention type with Id: ' + interventionTypeID);
      res.status(500).send({ error: err.toString() });
    }
    else {
      console.log('Intervention type with Id ' + interventionTypeID + ' has well been removed from DB');
      res.json(interventionType);
    }
  });
 };