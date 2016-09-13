'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Book = new Schema({
    bookId: String,
    name: String,
    cover: String,
    ownerEmail: String,
    available: Boolean
});

module.exports = mongoose.model('Book', Book);