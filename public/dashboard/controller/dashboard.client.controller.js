angular.module('dashboard').controller('DashboardCtrl', ['$scope', '$filter','$interval', 'Dashboard',
  function($scope, $filter, $interval, Dashboard) {
    $scope.refresh = function() {
      var hour = moment().get('hour');
      var startHour = null;

      if (hour >= 6 & hour < 14) {
          startHour = 6;
        } else {
          if (hour >= 14 & hour < 22) {
            startHour = 14;
          } else {
            startHour = 22;
          }
        }

      var startTimeQuery = moment().startOf('hour').set('hour', startHour).format('YYYY-MM-DD HH:mm:ss');
      var endTimeQuery = moment(startTimeQuery).add(7, 'hours').endOf('hour').format('YYYY-MM-DD HH:mm:ss');

      Dashboard.query({
        'startTime': startTimeQuery,
        'endTime': endTimeQuery
      }, function(response) {
        $scope.err = {
          status: 'OK'
        };

        var summary = _
          .chain(response)
          .filter({
            'fahrweg': 'Normal'
          })
          .flatMap(function(item) {
            return item.verwendung;
          })
          .countBy()
          .value();

        $scope.sumInclET = _
          .chain(summary)
          .values()
          .sum()
          .value();

        $scope.sumExclET = _
          .chain(summary)
          .omit('n/a')
          .values()
          .sum()
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
        var data = _.map(labelsData[1], function(n) {
          return _.round(n / $scope.sumInclET *100, 2);
        });

        $scope.summary = summary;
        $scope.rft = _.round(summary.OK / $scope.sumExclET * 100, 2);
        $scope.ftt = _.round(summary.OK / $scope.sumInclET * 100, 2);
        $scope.frq = _.round((summary.OK + summary['OK poliert']) / $scope.sumInclET * 100, 2);
        $scope.scrap = _.round(summary.Ausschuss / $scope.sumInclET * 100, 2);
        $scope.paintScrap = null;

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
