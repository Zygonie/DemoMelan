'use strict';
var app = angular.module('appClient', ['ngRoute', 'ngResource', 'ui.bootstrap']);

/*
 * Config
 */
app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
	$routeProvider
       .when('/client', {
         controller: 'ctrlClient',
         templateUrl: 'client'
       })
       .when('/client/:clientID', {
         controller: 'ctrlClientDetails',
         templateUrl: 'clientDetails'
       })
       .when('/clientDetails', {
         controller: 'ctrlClient',
         templateUrl: 'clientDetails'
       })
       .when('/interventions', {
         controller: 'ctrlInterventions',
         templateUrl: 'interventions'
       })
       .when('/logout', { redirectTo: '/logout' })
       .otherwise({ redirectTo: '/client' });
    $locationProvider.html5Mode(true);
}]);

/*
 * Services
 */
app.factory('SharedService', function($rootScope) {
  var sharedService = {};
  sharedService.data = {};
  return sharedService;
});

app.factory('Api',['$resource', function($resource) {
  return {
    Clients: $resource('/api/client'), //sans parametre ici, on utilise plutot un req.query au lieu d'un req.params !! pratique
    Interventions: $resource('/api/interventions'),
    InterventionTypes: $resource('/api/interventionTypes')
  };
}]);

app.factory('FlashService', function ($rootScope) {
  return {
    showError: function (message) {
      $rootScope.errorMessage = message;
      return message;
    },
    showSuccess: function (message) {
        $rootScope.successMessage = message;
        return message;
      },
    clear: function () {
      $rootScope.errorMessage = '';
      $rootScope.successMessage = '';
      return null;
    },
    getErrorMessage: function() {
      return $rootScope.errorMessage;
    },
    getSuccessMessage: function() {
        return $rootScope.successMessage;
      }
  };
});

/*
 * Directive Datepicker
 */
app.directive('datepicker', function() {
  return {
    restrict: 'C',
    require: 'ngModel',
    link: function(scope, el, attr, ngModelCtrl) {
      $(function(){
        el.datepicker({
          dateFormat:'dd MM yy',
          inline: true,
          onSelect: function(dateText, inst) {
            ngModelCtrl.$setViewValue(dateText);
            scope.$apply();
          }
        });
      });
    }
  };
});