'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Lead = mongoose.model('Lead'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, lead;

/**
 * Lead routes tests
 */
describe('Lead CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Lead
		user.save(function() {
			lead = {
				name: 'Lead Name'
			};

			done();
		});
	});

	it('should be able to save Lead instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Lead
				agent.post('/leads')
					.send(lead)
					.expect(200)
					.end(function(leadSaveErr, leadSaveRes) {
						// Handle Lead save error
						if (leadSaveErr) done(leadSaveErr);

						// Get a list of Leads
						agent.get('/leads')
							.end(function(leadsGetErr, leadsGetRes) {
								// Handle Lead save error
								if (leadsGetErr) done(leadsGetErr);

								// Get Leads list
								var leads = leadsGetRes.body;

								// Set assertions
								(leads[0].user._id).should.equal(userId);
								(leads[0].name).should.match('Lead Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Lead instance if not logged in', function(done) {
		agent.post('/leads')
			.send(lead)
			.expect(401)
			.end(function(leadSaveErr, leadSaveRes) {
				// Call the assertion callback
				done(leadSaveErr);
			});
	});

	it('should not be able to save Lead instance if no name is provided', function(done) {
		// Invalidate name field
		lead.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Lead
				agent.post('/leads')
					.send(lead)
					.expect(400)
					.end(function(leadSaveErr, leadSaveRes) {
						// Set message assertion
						(leadSaveRes.body.message).should.match('Please fill Lead name');
						
						// Handle Lead save error
						done(leadSaveErr);
					});
			});
	});

	it('should be able to update Lead instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Lead
				agent.post('/leads')
					.send(lead)
					.expect(200)
					.end(function(leadSaveErr, leadSaveRes) {
						// Handle Lead save error
						if (leadSaveErr) done(leadSaveErr);

						// Update Lead name
						lead.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Lead
						agent.put('/leads/' + leadSaveRes.body._id)
							.send(lead)
							.expect(200)
							.end(function(leadUpdateErr, leadUpdateRes) {
								// Handle Lead update error
								if (leadUpdateErr) done(leadUpdateErr);

								// Set assertions
								(leadUpdateRes.body._id).should.equal(leadSaveRes.body._id);
								(leadUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Leads if not signed in', function(done) {
		// Create new Lead model instance
		var leadObj = new Lead(lead);

		// Save the Lead
		leadObj.save(function() {
			// Request Leads
			request(app).get('/leads')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Lead if not signed in', function(done) {
		// Create new Lead model instance
		var leadObj = new Lead(lead);

		// Save the Lead
		leadObj.save(function() {
			request(app).get('/leads/' + leadObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', lead.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Lead instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Lead
				agent.post('/leads')
					.send(lead)
					.expect(200)
					.end(function(leadSaveErr, leadSaveRes) {
						// Handle Lead save error
						if (leadSaveErr) done(leadSaveErr);

						// Delete existing Lead
						agent.delete('/leads/' + leadSaveRes.body._id)
							.send(lead)
							.expect(200)
							.end(function(leadDeleteErr, leadDeleteRes) {
								// Handle Lead error error
								if (leadDeleteErr) done(leadDeleteErr);

								// Set assertions
								(leadDeleteRes.body._id).should.equal(leadSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Lead instance if not signed in', function(done) {
		// Set Lead user 
		lead.user = user;

		// Create new Lead model instance
		var leadObj = new Lead(lead);

		// Save the Lead
		leadObj.save(function() {
			// Try deleting Lead
			request(app).delete('/leads/' + leadObj._id)
			.expect(401)
			.end(function(leadDeleteErr, leadDeleteRes) {
				// Set message assertion
				(leadDeleteRes.body.message).should.match('User is not logged in');

				// Handle Lead error error
				done(leadDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Lead.remove().exec();
		done();
	});
});