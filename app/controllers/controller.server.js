'use strict';

var https = require('https');
var bl = require('bl');

var Users = require('../models/users.js');
var Books = require('../models/books.js');

function Controller () {
	
	this.updateProfile = function(req, res) {
		Users
			.findOne({email: req.user.email})
			.exec(function(err, doc) {
				if (err) throw err;
				
				console.log('updateProfile');
				
				doc.city = req.body.city;
				doc.state = req.body.state;
				
				doc.save(function(err) {
					if (err) {
						res.json({state: 'failed'});
						throw err;
					}
					
					res.json({state: 'success'});
				});
			});
	};
	
	this.updatePassword = function(req, res) {
		Users
			.findOne({email: req.user.email})
			.exec(function(err, doc) {
				if (err) throw err;
				
				if (doc.password !== req.body.currentPass) {
					res.json({state: 'invalid password'});
				} else {
					doc.password = createHash(req.body.newPass);
					doc.save(function(err) {
						if (err) {
							res.json({state: 'failed'});
						}	
						
						res.json({state: 'success'});
					});
				}
			});
	};
	
	this.addBook = function(req, res) {
		var apiUrl = 'https://www.googleapis.com/books/v1/volumes?q=' + req.body.name + '&maxResults=5&key=' + process.env.APIKEY;
		
		console.log('add book');
		https.get(apiUrl, function(response) {
			response.pipe(bl(function(err, buffer) {
				if (err) throw err;
				
				var data = JSON.parse(buffer);
				var newBook = new Books();
				
				newBook.bookId = data.items[0].id + ' ' + Date.now();
				newBook.name = data.items[0].volumeInfo.title;
				if (data.items[0].volumeInfo.imageLinks !== undefined)
					newBook.cover = 'https' + data.items[0].volumeInfo.imageLinks.smallThumbnail.substr(4);
				newBook.ownerEmail = req.user.email;
				newBook.available = true;
				
				newBook.save(function(err, result) {
					if (err) throw err;
					
					Users
						.findOne({email: result.ownerEmail})
						.exec(function(err, doc) {
							if (err) throw err;
							
							doc.bookIds.push(result.bookId);
							
							doc.save(function(err) {
								if(err) throw err;
								
								res.json({
									name: result.name,
									cover: result.cover,
									bookId: result.bookId
								});
							});
						});
				});
			}));
		});
	};
	
	this.delBook = function(req, res) {
		var bookIdToDel = req.body.bookId;
		
		console.log('del book');
		Users
			.findOne({email: req.user.email})
			.exec(function(err, doc) {
				if (err) throw err;
				
				var bookIds = doc.bookIds;
				
				doc.bookIds = [];
				bookIds.forEach(function(bookId) {
					if (bookId !== bookIdToDel)
						doc.bookIds.push(bookId);	
				});
				
				doc.save(function(err) {
					if (err) throw err;
					
					Books.remove({bookId: bookIdToDel, ownerEmail: req.user.email}, function(err) {
						if (err) throw err;
						
						res.json({});
					});
				});
			});
	};
	
	this.getAllBooks = function(req, res) {
		Books
			.find({}, {_id: 0})
			.exec(function(err, books) {
				if (err) throw err;
				
				var result = [];
				
				books.forEach(function(book) {
					var isMyOwnBook = (req.user.email === book.ownerEmail);
					
					result.push([book, isMyOwnBook]);
				});
				
				res.json(result);
			});
	};
	
	this.getMyBooks = function(req, res) {
		Books
			.find({ownerEmail: req.user.email}, {
				_id: 0,
				bookId: 1, 
				cover: 1,
				name: 1
			})
			.exec(function(err, books) {
				if (err) throw err;
				
				res.json(books);
			});
	};
	
	this.requestBook = function(req, res) {
		var bookId = req.body.bookId,
			ownerEmail = req.body.ownerEmail;
		
		Users
			.findOne({email: req.user.email})
			.exec(function(err, user) {
				if (err) throw err;
				
				user.request.push({
					ownerEmail: ownerEmail,
					bookId: bookId
				});
				user.save(function(err) {
					if (err) throw err;
					
					Books.findOne({bookId: bookId, ownerEmail: ownerEmail}, function(err, book) {
						if (err) throw err;
						
						if (book) {
							book.available = false;
							
							book.save(function(err) {
								if (err) throw err;
								
								Users.findOne({email: ownerEmail}, function(err, owner) {
									if (err) throw err;
									
									owner.requestsForMe.push({
										email: req.user.email,
										bookId: bookId
									});
									owner.save(function(err) {
										if (err) throw err;
										
										res.json({});
									});
								});
							});
						} else {
							res.json({});
						}
					});
				});
			});
	};
	//
	this.getDashboardRequest = function(req, res) {
		Users
			.findOne({email: req.user.email})
			.exec(function(err, user) {
				if (err) throw err;
				
				var count = 0;
				var data = [];
				var n = user.request.length;
				
				if (n === 0) 
					res.json([]);
				
				user.request.forEach(function(item, i) {
					Books
						.findOne({
							bookId: item.bookId,
							ownerEmail: item.ownerEmail
						}, function(err, doc) {
							if (err) throw err;
							
							if (doc) {
								data[i] = doc;
								count++;
								if (count === n)
									res.json(data);
							}
						});
				});
			});
	};
	
	this.getDashboardBorrow = function(req, res) {
		Users
			.findOne({email: req.user.email})
			.exec(function(err, user) {
				if (err) throw err;
				
				var count = 0;
				var data = [];
				var n = user.borrow.length;
				
				if (n === 0) 
					res.json([]);
				
				user.borrow.forEach(function(item, i) {
					Books
						.findOne({
							bookId: item.bookId,
							ownerEmail: item.ownerEmail
						}, function(err, doc) {
							if (err) throw err;
							
							if (doc) {
								data[i] = doc;
								count++;
								if (count === n)
									res.json(data)
							}
						});
				});
			});
	};
	
	this.getDashboardRequestsForMe = function(req, res) {
		Users
			.findOne({email: req.user.email})
			.exec(function(err, user) {
				if (err) throw err;
				
				var count = 0;
				var data = [];
				var n = user.requestsForMe.length
				
				if (n === 0) 
					res.json([]);
				
				user.requestsForMe.forEach(function(item, i) {
					Books
						.findOne({
							bookId: item.bookId,
							ownerEmail: req.user.email
						}, function(err, doc) {
							if (err) throw err;
							
							if (doc) {
								var obj = {};
								
								obj.bookId = doc.bookId;
								obj.name = doc.name;
								obj.email = item.email;
								data[i] = obj;
								count++;
								if (count === n) {
									res.json(data);
								}
							}
						});
				});
			});
	};
	
	this.getDashboardApprove = function(req, res) {
		Users
			.findOne({email: req.user.email})
			.exec(function(err, user) {
				if (err) throw err;
				
				var count = 0;
				var data = [];
				var n = user.approve.length;
				
				if (n === 0)
					res.json([]);
				
				user.approve.forEach(function(item, i) {
					Books
						.findOne({
							bookId: item.bookId,
							ownerEmail: req.user.email
						}, function(err, doc) {
							if (err) throw err;
							
							if (doc) {
								var obj = {};
								
								obj.bookId = doc.bookId;
								obj.name = doc.name;
								obj.email = item.email;
								data[i] = obj;
								count++;
								if (count === n) {
									res.json(data);
								}
							}
						});
				});
			});
	};
	//
	this.deleteRequest = function(req, res) {
		var bookId = req.body.bookId,
			email = req.body.email;
			
		Users
			.findOne({email: req.user.email})
			.exec(function(err, owner) {
				if (err) throw err;
				
				var reqsForMe = owner.requestsForMe;
				
				owner.requestsForMe = [];
				reqsForMe.forEach(function(request) {
					if (request.bookId !== bookId || request.email !== email)
						owner.requestsForMe.push(request);
				});
				
				var approve = owner.approve;
				
				owner.approve = [];
				approve.forEach(function(request) {
					if (request.bookId !== bookId || request.email !== email)
						owner.approve.push(request);
				});
				
				owner.save(function(err) {
					if (err) throw err;
					
					Users
						.findOne({email: email})
						.exec(function(err, user) {
							if (err) throw err;
							
							var requests = user.request;
							
							user.request = [];
							requests.forEach(function(request) {
								if (request.bookId !== bookId || request.ownerEmail !== req.user.email)
									user.request.push(request);	
							});
							
							var borrows = user.borrow;
							
							user.borrow = [];
							borrows.forEach(function(request) {
								if (request.bookId !== bookId || request.ownerEmail !== req.user.email) 
									user.borrow.push(request);
							});
							
							user.save(function(err) {
								if (err) throw err;
								
								Books
									.findOne({
										bookId: bookId,
										ownerEmail: req.user.email
									})
									.exec(function(err, book) {
										if (err) throw err;
										
										book.available = true;
										book.save(function(err) {
											if (err) throw err;
											
											res.json({});
										});
									});
							});
						});
				});
			});
	};
	
	this.approveRequest = function(req, res) {
		var bookId = req.body.bookId,
			email = req.body.email;
			
		Users
			.findOne({email: req.user.email})
			.exec(function(err, owner) {
				if (err) throw err;
				
				var reqsForMe = owner.requestsForMe;
				
				owner.requestsForMe = [];
				reqsForMe.forEach(function(request) {
					if (request.bookId !== bookId || request.email !== email)
						owner.requestsForMe.push(request);
				});
				
				owner.approve.push({
					bookId: bookId,
					email: email
				});
				
				owner.save(function(err) {
					if (err) throw err;
					
					Users
						.findOne({email: email})
						.exec(function(err, user) {
							if (err) throw err;
							
							var requests = user.request;
							
							user.request = [];
							requests.forEach(function(request) {
								if (request.bookId !== bookId || request.ownerEmail !== req.user.email)
									user.request.push(request);	
							});
							
							user.borrow.push({
								bookId: bookId,
								ownerEmail: req.user.email
							});
							
							user.save(function(err, user) {
								if (err) throw err;
								
								res.json({});
							});
						});
				});
			});
	};
	//
	this.deleteMyRequest = function(req, res) {
		var bookId = req.body.bookId,
			ownerEmail = req.body.ownerEmail;
			
		Users
			.findOne({email: ownerEmail})
			.exec(function(err, owner) {
				if (err) throw err;
				
				var reqsForOwner = owner.requestsForMe;
				
				owner.requestsForMe = [];
				reqsForOwner.forEach(function(request) {
					if (request.bookId !== bookId || request.email !== req.user.email)
						owner.requestsForMe.push(request);
				});
				
				var ownerApprove = owner.approve;
				
				owner.approve = [];
				ownerApprove.forEach(function(request) {
					if (request.bookId !== bookId || request.email !== req.user.email)
						owner.approve.push(request);
				});
				
				owner.save(function(err) {
					if (err) throw err;
					
					Users	
						.findOne({email: req.user.email})
						.exec(function(err, user) {
							if (err) throw err;
							
							var myRequests = user.request;
							
							user.request = [];
							myRequests.forEach(function(request) {
								if (request.bookId !== bookId || request.ownerEmail !== ownerEmail)
									user.request.push(request);	
							});
							
							var myBorrows = user.borrow;
							
							user.borrow = [];
							myBorrows.forEach(function(request) {
								if (request.bookId !== bookId || request.ownerEmail !== ownerEmail)
									user.borrow.push(request);	
							});
							
							user.save(function(err) {
								if (err) throw err;
								
								Books.findOne({bookId: bookId, ownerEmail: ownerEmail}, function(err, book) {
								    if (err) throw err;
								    
								    book.available = true;
								    
								    book.save(function(err) {
								    	if (err) throw err;
								    	
								    	res.json({});
								    });
								});
							});
						});
				});
			});
	};
}

module.exports = Controller;
