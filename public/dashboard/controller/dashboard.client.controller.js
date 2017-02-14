angular.module('dashboard').controller('DashboardCtrl', ['$scope', '$filter','$interval', 'Dashboard',
  function($scope, $filter, $interval, Dashboard) {
    $scope.refresh = function() {
      var startTimeQuery = moment().startOf('hour').set('hour', 6).format('YYYY-MM-DD HH:mm:ss');
      var endTimeQuery = moment().endOf('hour').set('hour', 13).format('YYYY-MM-DD HH:mm:ss');

      Dashboard.query({
        'startTime': startTimeQuery,
        'endTime': endTimeQuery
      }, function(response) {
        $scope.err = {
          status: 'OK'
        };

        var summary = _
          .chain(response)
          .flatMap(function(item) {
            return item.verwendung;
          })
          .countBy()
          .value();

        var defects = _
          .chain(response)
          .flatMap(function(item) {
            if (_.has(item, 'fehlerart')) {
              return item.fehlerart.fehlerart_text;
            } else {
              return null;
            }
          })
          .countBy()
          .entries()
          .remove(function(n) {
            return n[0] != 'null';
          })
          .sortBy(function(a) {
            return a[1];
          })
          .reverse()
          .value();

        var labelsData = _.unzip(defects);
        var labels = labelsData[0];
        var data = labelsData[1];

        var sum = _
          .chain(summary)
          .values()
          .sum()
          .value();

        $scope.frq = _.round(summary.OK / sum * 100, 2);
        $scope.scrap = _.round(summary.Ausschuss / sum * 100, 2);
        $scope.defects = defects;
        $scope.defectsChartLabels = labels;
        $scope.defectsChartData = data;
      },
      function(err) {
        $scope.err = err;
      });
    }
    $scope.defectsChartOptions = {
      scales: {
        xAxes: [{
          ticks: {
            fontFamily: 'Comfortaa',
            fontSize: 18,
            autoSkip: false
          }
        }],
        yAxes: [{
          ticks: {
            fontFamily: 'Comfortaa',
            fontSize: 16,
            autoSkip: false
          }
        }]
      }
    };

  // Auto refresh every 30 seconds
  autoRefresh = $interval($scope.refresh, 30000);
  $scope.$on('$destroy', function() {
    $interval.cancel(autoRefresh);
  });

  }
]);
