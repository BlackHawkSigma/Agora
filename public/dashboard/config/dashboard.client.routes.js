angular.module('dashboard').config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when("/dashboard", {
      templateUrl:"dashboard",
      name: "Dashboard"
    });
  }
]);
