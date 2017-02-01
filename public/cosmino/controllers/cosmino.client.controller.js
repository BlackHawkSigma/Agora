angular.module('cosmino').controller('TimepickerCtrl',['$scope', '$interval', 'uibDateParser', 'Export',
function ($scope, $interval, uibDateParser, Export) {
  $scope.dateFormat = 'dd.MM.yy HH:mm';

  $scope.isCollapsed = true;

  $scope.endTime = new Date().setSeconds(0);

  $scope.startTime = (function() {
    this.setDate(this.getDate()-1);
    this.setMinutes(0);
    this.setSeconds(0);
    return this
  }).call(new Date());

  $scope.hstep = 1;
  $scope.mstep = 15;
  $scope.ismeridian = false;

  $scope.setEarly = function() {
    $scope.startTime = new Date($scope.startTime).setHours(6);
    $scope.endTime = new Date($scope.endTime).setHours(14);
  };
  $scope.setLate = function() {
    $scope.startTime = new Date($scope.startTime).setHours(14);
    $scope.endTime = new Date($scope.endTime).setHours(22);
  };
  $scope.setNight = function() {
    $scope.startTime = new Date($scope.startTime).setHours(22);
    $scope.endTime = new Date($scope.endTime).setHours(6);
  };
  $scope.updateTimes = function() {
    $scope.isCollapsed = true;
    var startTime = Date.parse($scope.startTime) / 1000;
    var endTime = Date.parse($scope.endTime) / 1000;
    $scope.$parent.export = Export.query({
      startTime,
      endTime
    });
  };

  // $interval promise
  stopUpdate = $interval($scope.updateTimes, 60000);

  $scope.$on('$destroy', function() {
    $interval.cancel(stopUpdate);
  });
}]);
