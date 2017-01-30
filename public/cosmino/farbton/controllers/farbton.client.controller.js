angular.module('farbton').controller('FarbtonCtrl', ['$scope', '$routeParams', '$location', 'Farbton',
function($scope, $routeParams, $location, Farbton) {
  $scope.find = function() {
    Farbton.query(function(data) {
      $scope.colors = data;
    }, function(err) {
      $scope.err = err;
    });
  };
}]);
