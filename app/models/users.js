'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	name: String,
	email: String,
	password: String,
	city: String,
	state: String,
	bookIds: [String],
	borrow: [{
		ownerEmail: String,
		bookId: String
	}],
	request: [{
		bookId: String,
		ownerEmail: String
	}],
	approve: [{
		email: String,
		bookId: String
	}],
	requestsForMe: [{
		email: String,
		bookId: String
	}]
});

module.exports = mongoose.model('User', User);
