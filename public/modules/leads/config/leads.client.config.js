'use strict';

// Configuring the Articles module
angular.module('leads').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Leads', 'leads', 'leads');
		//Menus.addSubMenuItem('topbar', 'leads', 'List Leads', 'leads');
		//Menus.addSubMenuItem('topbar', 'leads', 'New Lead', 'leads/create');
	}
]);
