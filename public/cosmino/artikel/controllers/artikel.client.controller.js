angular.module('artikel').controller('ArtikelCtrl', ['$scope', '$routeParams', '$location', 'Artikel',
function($scope, $routeParams, $location, Artikel) {
  $scope.find = function() {
    Artikel.query(function(data) {
      $scope.artikel = data;
    }, function(err) {
      $scope.err = err;
    });
  };
}]);
