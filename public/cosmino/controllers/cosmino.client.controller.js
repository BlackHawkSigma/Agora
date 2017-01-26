angular.module('cosmino').controller('TimepickerDemoCtrl', function ($scope) {
  var time = new Date();
  $scope.mytime = time.setMinutes(0);

  $scope.hstep = 1;
  $scope.mstep = 15;

  $scope.ismeridian = false;
  $scope.toggleMode = function() {
    $scope.ismeridian = ! $scope.ismeridian;
  };

  $scope.setEarly = function() {
    var d = new Date();
    d.setHours( 6 );
    d.setMinutes( 0 );
    $scope.mytime = d;
  };
  $scope.setLate = function() {
    var d = new Date();
    d.setHours( 14 );
    d.setMinutes( 0 );
    $scope.mytime = d;
  };
  $scope.setNight = function() {
    var d = new Date();
    d.setHours( 22 );
    d.setMinutes( 0 );
    $scope.mytime = d;
  };
});
