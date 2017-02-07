angular.module('rejections').config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when("/rejections", {
      templateUrl: "rejections",
      name: "Rückweisungen"
    });
  }
]);
