angular.module('cosmino').config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/', {
      templateUrl: 'cosmino/view'
    }).
    otherwise({
      redirectTo: '/'
    });
  }
]);
