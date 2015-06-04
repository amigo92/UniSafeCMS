'use strict';

// Leads controller

var leadsApp = angular.module('leads');

leadsApp.controller('LeadsController', ['$scope','$stateParams', '$location', 'Authentication', 'Leads','Users','$modal', '$log',
	function($scope, $stateParams, $location, Authentication, Leads,Users ,$modal, $log) {

		this.authentication = Authentication;

		// Find a list of Leads
		this.leads = Leads.query();
		//this.users=Users.query();                  Teri makanakisaka user :'(



		//open a modal window to create a single lead record
		this.modalCreate = function(size) {

			var modalInstance = $modal.open({
				templateUrl: 'modules/leads/views/create-lead.client.view.html',
				controller: function($scope, $modalInstance) {


					$scope.ok = function() {

						// if (createLeadForm.$valid){
						$modalInstance.close();
						// }
					};

					$scope.cancel = function() {
						$modalInstance.dismiss('cancel');
					};

				},

				size: size

			});

			modalInstance.result.then(function(selectedItem) {

			}, function() {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};







		//pasted in from angular-ui bootstrap modal example
		//open a modal window to update a single lead record
		this.modalUpdate = function(size, selectedLead) {

			var modalInstance = $modal.open({
				templateUrl: 'modules/leads/views/edit-lead.client.view.html',
				controller: function($scope, $modalInstance, lead) {
					$scope.lead = lead;

					$scope.ok = function() {

						// if (updateLeadForm.$valid){
						$modalInstance.close($scope.lead);
						// }
					};

					$scope.cancel = function() {
						$modalInstance.dismiss('cancel');
					};

				},

				size: size,
				resolve: {
					lead: function() {
						return selectedLead;
					}
				}
			});

			modalInstance.result.then(function(selectedItem) {
				$scope.selected = selectedItem;
			}, function() {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};


		// Remove existing Lead
		this.remove = function(lead) {
			if (lead) {
				lead.$remove();

				for (var i in this.leads) {
					if (this.leads[i] === lead) {
						this.leads.splice(i, 1);
					}
				}
			} else {
				this.lead.$remove(function() {});
			}
		};

	}
]);

leadsApp.controller('LeadsCreateController', ['$scope', 'Leads', 'Notify',
	function($scope, Leads, Notify) {
		// Create new Lead
		this.create = function() {
			// Create new Lead object
			var lead = new Leads({
				firstName: this.firstName,
				lastName: this.lastName,
				city: this.city,
				country: this.country,
				industry: this.industry,
				email: this.email,
				phone: this.phone,
				referred: this.referred,
				channel: this.channel
			});

			// Redirect after save
			lead.$save(function(response) {

				Notify.sendMsg('NewLead', {
					'id': response._id
				});

				// // Clear form fields
				// $scope.firstName = '';
				// $scope.lastName = '';
				// $scope.city = '';
				// $scope.country = '';
				// $scope.industry = '';
				// $scope.email = '';
				// $scope.phone = '';
				// $scope.referred = '';
				// $scope.channel = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

	}
]);
leadsApp.controller('LeadsUpdateController', ['$scope', 'Leads',
	function($scope, Leads) {
		$scope.channelOptions = [
			{id: 1 , item: 'Facebook'},
			{id: 2 , item: 'Twitter'},
			{id: 3 , item: 'Email'},
		];


		// Update existing Lead
		this.update = function(updatedLead) {
			var lead = updatedLead;

			lead.$update(function() {

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

	}
]);

leadsApp.directive('leadList', ['Leads', 'Notify', function(Leads, Notify) {
	return {
		restrict: 'E',
		transclude: true,
		templateUrl: 'modules/leads/views/lead-list-template.html',
		link: function(scope, element, attrs) {
			//when a new lead is added, update the lead list
			Notify.getMsg('NewLead', function(event, data) {

				scope.leadsCtrl.leads = Leads.query();

			});
		}
	};
}]);
