'use strict';


angular.module('leads')
	//Leads service used to communicate Leads REST endpoints
	.factory('Leads', ['$resource',
		function($resource) {
			return $resource('leads/:leadId', {
				leadId: '@_id'
			}, {
				update: {
					method: 'PUT'
				}
			});
		}
	])


	.factory('Notify', ['$rootScope', function($rootScope) {
		var notify = {};

		notify.sendMsg = function(msg, data) {
			data = data || {};
			$rootScope.$emit(msg, data);

			console.log('message sent!');
		};

		notify.getMsg = function(msg, func, scope) {
			var unbind = $rootScope.$on(msg, func);

			if (scope) {
				scope.$on('destroy', unbind);
			}
		};

		return notify;
	}])
/* For fucks sake :/
.factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
*/
