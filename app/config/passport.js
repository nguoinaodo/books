'use strict';
//config strategy
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users.js');
var bCrypt = require('bcrypt-nodejs');

module.exports = function (passport) {
	function createHash(password) {
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	}
	
	var isValidPassword = function(user, password){
		return bCrypt.compareSync(password, user.password);
	};
	
	passport.serializeUser(function (user, done) {
		done(null, user._id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});
	
	// register strategy
	
	passport.use('signup', new LocalStrategy({
		usernameField: 'email',
		passReqToCallback: true
	}, function(req, email, password, done) {
		var findOrCreateUser = function() {
			User.findOne({email: email}, function(err, user) {
				if (err) {
					console.log('error in signup: ' + err);
					return done(err);
				}	
				
				if (user) {
					console.log('user already exists');
					return done(null, false, {message: 'user already exists'});
				} else {
					var newUser = new User();
					
					newUser.email = email;
					newUser.password = createHash(password);
					newUser.name = req.params.name;
					
					newUser.save(function(err) {
						if (err) {
							console.log('error in save new user: ' + err);
							throw err;
						}	
						
						console.log('user registration successful');
						return done(null, newUser);
					});
				}
			});
		};
		
		process.nextTick(findOrCreateUser);
	}));
	
	// login strategy
	
	passport.use('login', new LocalStrategy({
		usernameField: 'email',
		passReqToCallback: true
	}, function(req, email, password, done) {
		console.log('login');
		User.findOne({email: email}, function(err, user) {
			if (err) return done(err);
			
			if (!user) {
				return done(null, false, {message: 'user not found'});
			}
			
			if (!isValidPassword(user, password)) {
				return done(null, false, {message: 'incorrect password'});
			}
			
			return done(null, user);
		});
	}));
	
	
	/*
	passport.use(new GitHubStrategy({
		clientID: configAuth.githubAuth.clientID,
		clientSecret: configAuth.githubAuth.clientSecret,
		callbackURL: configAuth.githubAuth.callbackURL
	},
	function (token, refreshToken, profile, done) {
		process.nextTick(function () {
			User.findOne({ 'github.id': profile.id }, function (err, user) {
				if (err) {
					return done(err);
				}

				if (user) {
					return done(null, user);
				} else {
					var newUser = new User();

					newUser.github.id = profile.id;
					newUser.github.username = profile.username;
					newUser.github.displayName = profile.displayName;
					newUser.github.publicRepos = profile._json.public_repos;
					newUser.nbrClicks.clicks = 0;

					newUser.save(function (err) {
						if (err) {
							throw err;
						}

						return done(null, newUser);
					});
				}
			});
		});
	}));
	*/
};
