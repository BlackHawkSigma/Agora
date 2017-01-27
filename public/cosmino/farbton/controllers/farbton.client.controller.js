angular.module('farbton').controller('FarbtonCtrl', ['$scope', '$routeParams', '$location', 'Farbton',
function($scope, $routeParams, $location, Farbton) {
  $scope.find = function() {
    $scope.colors = Farbton.query();
  };
}]);
