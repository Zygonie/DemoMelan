/*
 * User Schema
 */
var mongoose = require('mongoose'),
	bcrypt = require('bcrypt-nodejs'),
	Schema = mongoose.Schema,
	SALT_WORK_FACTOR = 10;

// User schema
var UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String}
});

//generating a hash
UserSchema.methods.generateHash = function(password) {
 return bcrypt.hashSync(password, bcrypt.genSaltSync(SALT_WORK_FACTOR), null);
};

//checking if password is valid
UserSchema.methods.validPassword = function(password) {
 return bcrypt.compareSync(password, this.password);
};

// Export user model
module.exports = mongoose.model('User', UserSchema);