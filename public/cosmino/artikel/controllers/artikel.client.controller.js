angular.module('artikel').controller('ArtikelCtrl', ['$scope', '$routeParams', '$location', 'Artikel',
function($scope, $routeParams, $location, Artikel) {
  $scope.find = function() {
    $scope.artikel = Artikel.query();
  };
}]);
