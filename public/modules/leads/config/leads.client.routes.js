'use strict';

//Setting up route
angular.module('leads').config(['$stateProvider',
	function($stateProvider) {
		// Customers state routing
		$stateProvider.
			state('listLeads', {
				url: '/leads',
				templateUrl: 'modules/leads/views/list-leads.client.view.html'
			});

	}
]);
