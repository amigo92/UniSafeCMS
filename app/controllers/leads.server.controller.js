'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Lead = mongoose.model('Lead'),
	User = mongoose.model('User'),
	_ = require('lodash');

/**
 * Create a Lead
 */
exports.create = function(req, res) {
	var lead = new Lead(req.body);
	lead.user = req.user;

	lead.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(lead);
		}
	});
};

/**
 * Show the current Lead
 */
exports.read = function(req, res) {
	res.jsonp(req.lead);
};

/**
 * Update a Lead
 */
exports.update = function(req, res) {
	var lead = req.lead ;

	lead = _.extend(lead , req.body);

	lead.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(lead);
		}
	});
};

/**
 * Delete an Lead
 */
exports.delete = function(req, res) {
	var lead = req.lead ;

	lead.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(lead);
		}
	});
};

/**
 * List of Leads
 */
exports.list = function(req, res) { 
	Lead.find().sort('-created').populate('user', 'displayName').exec(function(err, leads) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(leads);
		}
	});
};

/**
 * Lead middleware
 */
exports.leadByID = function(req, res, next, id) { 
	Lead.findById(id).populate('user', 'displayName').exec(function(err, lead) {
		if (err) return next(err);
		if (! lead) return next(new Error('Failed to load Lead ' + id));
		req.lead = lead ;
		next();
	});
};

/**
 * Lead authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.lead.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
