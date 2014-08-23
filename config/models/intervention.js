/*
 * Intervention Schema
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	InterventionTypes = require('./interventionTypes');
	
// Intervention schema
var InterventionSchema = new Schema({
  client: { type : Schema.ObjectId, ref : 'Client', required: true },
  type: { type : Schema.ObjectId, ref : 'InterventionType', required: true },
  notes: { type: String },
  price: { type: Number, required: true },
  date: { type: Date, default: Date.now}
});

// Export user model
module.exports = mongoose.model('Intervention', InterventionSchema);