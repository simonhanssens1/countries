
var mongoose = require('mongoose');

module.exports = mongoose.model('user',{	
	facebook_id: String,
	username: String,
	highscore: String
});