/* global angular */

angular.module('cosmino').config(['$routeProvider',
  function ($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl: 'cosmino/view',
      name: 'Main'
    })
    .otherwise({
      redirectTo: '/'
    })
  }
])
