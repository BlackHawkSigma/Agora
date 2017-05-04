/* global angular */

angular.module('paintlineApp').controller('NavCtrl', ['$scope', '$interval',
  function ($scope, $interval) {
    function updateClock () {
      $scope.nowUnix = new Date().getTime() / 1000 | 0
    };

    var stopClock = $interval(updateClock, 100)

    $scope.$on('$destroy', function () {
      $interval.cancel(stopClock)
    })
  }])
