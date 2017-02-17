angular.module('cosmino').controller('TimepickerCtrl',['$scope', '$interval', 'uibDateParser', 'Export',
function ($scope, $interval, uibDateParser, Export) {
  $scope.dateFormat = 'dd.MM.yy HH:mm';

  $scope.isCollapsed = true;

  $scope.endTime = new Date(moment().startOf('hour').set('hour', 14).toISOString());
  $scope.startTime = new Date(moment().startOf('hour').set('hour', 6).toISOString());

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
    var startTime = new Date(Date.parse(new Date($scope.startTime)) + 3600000);
    var endTime = new Date(Date.parse(new Date($scope.endTime)) + 3600000);
    Export.query({
      'startTime': startTime,
      'endTime': endTime
    }, function(data) {
      $scope.$parent.export = data;
      var summary = _
        .chain(data)
        .flatMap(function(item) {
          return item.verwendung;
        })
        .countBy()
        .value();

      $scope.$parent.summary = summary

      var sum = _
        .chain(summary)
        .values()
        .sum()
        .value();

      $scope.$parent.frq = _.round(summary.OK / sum * 100, 2);
      $scope.$parent.scrap = _.round(summary.Ausschuss / sum * 100, 2);
    });
  };

  // $interval promise
  stopUpdate = $interval($scope.updateTimes, 300000);

  $scope.$on('$destroy', function() {
    $interval.cancel(stopUpdate);
  });
}]);
