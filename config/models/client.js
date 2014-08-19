/*
 * Client Schema
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// Client schema
var ClientSchema = new Schema({
  name: { type: String, required: true },
  forename: { type: String, required: true },
  phone: { type: String, required: true },
  assMaladie: { type: String },
  assureur: { type: String }
});

// Export user model
module.exports = mongoose.model('Client', ClientSchema);