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
        // Save moment of last server connection
        $scope.lastUpdate = moment();

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
          .filter({
            'verwendung': 'NA',
            'verwendung': 'Ausschuss'
          })
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

        var paintScrap = _
          .chain(response)
          .filter({
            'fahrweg': 'Normal',
            'verwendung': 'Ausschuss'
          })
          .flatMap(function(item) {
            return item.artikeldaten;
          })
          .value();

        var labelsData = _.unzip(defects);
        var data = _.map(labelsData[1], function(n) {
          return _.round(n / $scope.sumInclET *100, 1);
        });
        var labels = _.map(labelsData[0], function(value, index) {
          return "".concat(value, ": ", data[index], "%");
        });

        $scope.summary = summary;
        $scope.rft = summary.OK / $scope.sumExclET * 100;
        $scope.ftt = summary.OK / $scope.sumInclET * 100;
        $scope.frq = (summary.OK + summary['OK poliert']) / $scope.sumInclET * 100;
        $scope.scrap = summary.Ausschuss / $scope.sumInclET * 100;
        $scope.paintScrap = _.sumBy(paintScrap, 'preis') / 1000;

        $scope.defects = defects;
        $scope.defectsChartLabels = labels;
        $scope.defectsChartData = data;
      },
      function(err) {
        $scope.err = err;
        $scope.lastUpdateHuman = moment().from($scope.lastUpdate, true);
      });
    }
    $scope.defectsChartOptions = {
      scales: {
        xAxes: [{
          ticks: {
            display: false,
            stepSize: 1,
            suggestedMax: 2,
            beginAtZero: true
          }
        }],
        yAxes: [{
          ticks: {
            // fontFamily: 'Comfortaa',
            fontSize: 18,
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
