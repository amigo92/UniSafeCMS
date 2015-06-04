'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var leads = require('../../app/controllers/leads.server.controller');

	// Leads Routes
	app.route('/leads')
		.get(leads.list)
		//.get(users.list)
		.post(users.requiresLogin, leads.create);

	app.route('/leads/:leadId')
		.get(leads.read)
		.put(users.requiresLogin, leads.hasAuthorization, leads.update)
		.delete(users.requiresLogin, leads.hasAuthorization, leads.delete);

	// Finish by binding the Lead middleware
	app.param('leadId', leads.leadByID);
};
