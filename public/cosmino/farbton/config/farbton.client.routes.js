angular.module('farbton').config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when("/farbton", {
      templateUrl: "cosmino/farbton",
      name: "Farben"
    });
  }
]);
