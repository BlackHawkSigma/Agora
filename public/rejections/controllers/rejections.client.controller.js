angular.module('rejections').controller('RejectionsCtrl', ['$scope', '$routeParams', '$location','$filter', 'Rejections',
  function($scope, $routeParams, $location, $filter, Rejections) {
    $scope.artikel = null;
    $scope.startTime = '2017-02-07';

    $scope.find = function() {
      Rejections.query({
        'artikel': $scope.artikel,
        'startTime': $scope.startTime
      }, function(data) {
          console.log(data);
          $scope.rejections = data;
          }, function(err) {
            $scope.err = err;
            });
    };
  }
]);
