'use strict';

var path = process.cwd();
var Controller = require(path + '/app/controllers/controller.server.js');

module.exports = function (app, passport) {
	var controller = new Controller();
	
	app.route('/')
		.get(function(req, res) {
			res.render('home', {
				auth: req.isAuthenticated()	
			});
		});	
	
	
	
	app.route('/allbooks')
		.get(function(req, res) {
			if (req.isAuthenticated()) {
				res.sendFile(process.cwd() + '/public/books.html');
			} else {
				res.redirect('/login');
			}
		});
	
	app.route('/mybooks')
		.get(function(req, res) {
			if (req.isAuthenticated()) {
				res.sendFile(process.cwd() + '/public/mybooks.html');
			} else {
				res.redirect('/login');
			}
		});
	
	app.route('/setting')
		.get(function(req, res) {
			if (req.isAuthenticated()) {
				res.sendFile(process.cwd() + '/public/setting.html');
			} else {
				res.redirect('/login');
			} 
		});
	// authenticate
	app.route('/login')
		.get(function(req, res) {
			res.render('login', {
				auth: req.isAuthenticated()	
			});	
		})
		.post(passport.authenticate('login', {
			successRedirect: '/',
			failureRedirect: '/login',
			failureFlash: true
		}));
	
	app.route('/signup')
		.get(function(req, res) {
			res.render('signup', {
				auth: req.isAuthenticated()	
			});
		})
		.post(passport.authenticate('signup', {
			successRedirect: '/',
			failureRedirect: '/signup', 
			failureFlash: true
		}));
	
	app.route('/logout')
		.get(function(req, res) {
			req.logout();
			res.redirect('/');
		});
	//////////////////	
	// api
	app.route('/api/settingProfile')
		.post(controller.updateProfile);
	
	app.route('/api/settingPassword')
		.post(controller.updatePassword);
	
	app.route('/api/addbook')
		.post(controller.addBook);
	
	app.route('/api/delbook')
		.post(controller.delBook);
	
	app.route('/api/allbooks')
		.get(controller.getAllBooks);
	
	app.route('/api/mybooks')
		.get(controller.getMyBooks);
		
	app.route('/api/request')
		.post(controller.requestBook);
	// get dashboard info
	app.route('/api/dashboard/request')
		.get(controller.getDashboardRequest);
	
	app.route('/api/dashboard/borrow')
		.get(controller.getDashboardBorrow);
	
	app.route('/api/dashboard/requestsForMe')
		.get(controller.getDashboardRequestsForMe);
	
	app.route('/api/dashboard/approve')
		.get(controller.getDashboardApprove);
	
	app.route('/api/delReq')
		.post(controller.deleteRequest);
	
	app.route('/api/delMyReq')
		.post(controller.deleteMyRequest);
	
	app.route('/api/approveReq')
		.post(controller.approveRequest);
	
	/*
	app.route('/')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});

	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);
	*/
};
