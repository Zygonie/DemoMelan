/*
 * InterventionType Schema
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// InterventionType schema
var InterventionTypeSchema = new Schema({
  name: { type: String, unique: true },
  description: { type: String }
});

// Export user model
module.exports = mongoose.model('InterventionType', InterventionTypeSchema);