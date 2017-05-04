/* global angular */

angular.module('tools_robStatus').config(['$routeProvider',
  function ($routeProvider) {
    $routeProvider
      .when('/tools/robStatus', {
        templateUrl: 'tools',
        name: 'Tools'
      })
  }
])
