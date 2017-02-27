angular.module('dashboard').controller('DashboardCtrl', ['$scope', '$filter','$interval', 'Dashboard', 'Rejections',
  function($scope, $filter, $interval, Dashboard, Rejections) {
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
      if (startHour == 22) {
        startTimeQuery = moment(startTimeQuery).subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss')
      }
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

        var bigPartsInclSpare = _
          .chain(response)
          .filter({
            'artikelart': 'Großteil'
          })
          .value();

        var bigPartsExclSpare = _
          .chain(response)
          .filter({
            'artikelart': 'Großteil',
            'fahrweg': 'Normal'
          })
          .value();

        var summaryInclSpare = _
          .chain(bigPartsInclSpare)
          .flatMap(function(item) {
            return item.verwendung;
          })
          .countBy()
          .value();

        var summaryExclSpare = _
          .chain(bigPartsExclSpare)
          .flatMap(function(item) {
            return item.verwendung;
          })
          .countBy()
          .value();

        $scope.sumInclSpare = _
          .chain(summaryInclSpare)
          .omit('n/a')
          .values()
          .sum()
          .value();

        $scope.sumExclSpare = _
          .chain(summaryExclSpare)
          .values()
          .sum()
          .value();

        var defects = _
          .chain(bigPartsInclSpare)
          .filter(function(o) {
            return o.verwendung == 'Ausschuss'
              || o.verwendung == 'NA';
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
          .take(10)
          .value();

        var paintScrap = _
          .chain(bigPartsExclSpare)
          .filter(function(o) {
            return o.verwendung == 'Ausschuss'
          })
          .flatMap(function(item) {
            return item.artikeldaten;
          })
          .sumBy('preis')
          .value();

        var sumValueExclSpare = _.sumBy(bigPartsExclSpare, 'artikeldaten.preis')

        var sumScrapRework = _
          .chain(bigPartsExclSpare)
          .filter(function(o) {
            return  o.verwendung == 'NA'
          })
          .flatMap(function(item) {
            if (item.artikeldaten != undefined) {
              return (item.artikeldaten.preis - item.rohteilWert)
            } else {
              return 0
            }
          })
          .sum()
          .value()


        var labelsData = _.unzip(defects);
        var data = _.map(labelsData[1], function(n) {
          return _.replace(_.toString(_.round(n / $scope.sumInclSpare * 100, 1)), '.', ',');
        });
        var labels = _.map(labelsData[0], function(value, index) {
          return "".concat(value, ": ", data[index], "% ");
        });

        // Check for null values
        summaryInclSpare.OK = (_.isNumber(summaryInclSpare.OK) ? summaryInclSpare.OK : 0 );
        summaryExclSpare.OK = (_.isNumber(summaryExclSpare.OK) ? summaryExclSpare.OK : 0 );
        summaryInclSpare['OK poliert'] = (_.isNumber(summaryInclSpare['OK poliert']) ? summaryInclSpare['OK poliert'] : 0 );
        summaryInclSpare.Ausschuss = (_.isNumber(summaryInclSpare.Ausschuss) ? summaryInclSpare.Ausschuss : 0 );

        $scope.summaryInclSpare = summaryInclSpare;
        $scope.summaryExclSpare = summaryExclSpare;
        $scope.rft = summaryExclSpare.OK / $scope.sumExclSpare * 100;
        $scope.ftt = summaryInclSpare.OK / $scope.sumInclSpare * 100;
        $scope.frq = _.sum([summaryInclSpare.OK, summaryInclSpare['OK poliert']]) / $scope.sumInclSpare * 100;
        $scope.scrap = (paintScrap + sumScrapRework) / sumValueExclSpare * 100;
        $scope.paintScrap = (paintScrap + sumScrapRework) / 1000;
        $scope.sumValueExclSpare = sumValueExclSpare / 1000;

        $scope.defects = defects;
        $scope.defectsChartLabels = labels;
        $scope.defectsChartData = labelsData[1];
      },
      function(err) {
        $scope.err = err;
        $scope.lastUpdateHuman = moment().from($scope.lastUpdate, true);
      });

      // Show all rejections since 6am
      var startTimeRejections = moment().startOf('hour').set('hour', 6).format('YYYY-MM-DD HH:mm:ss');
      var endTimeRejections = moment(startTimeRejections).add(1, 'days').format('YYYY-MM-DD HH:mm:ss');
      Rejections.query({
        'startTime': startTimeRejections,
        'endTime': endTimeRejections
      }, function(result) {
        // Fill array with all defects
        defectList = _.flatMap(result, function(item) {
          return item.fehlerart.fehlerart_text;
        });
        // Defects summary
        var defectsSummary = _
          .chain(defectList)
          .countBy()
          .entries()
          .sortBy(function(a) {
            return a[1];
          })
          .reverse()
          .unzip()
          .value();

        $scope.rejectionsChartLabels = defectsSummary[0];
        $scope.rejectionsChartData = defectsSummary[1];
        $scope.rejectionsSum  = _.sum(defectsSummary[1]);

      });
    }
    $scope.defectsChartOptions = {
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          ticks: {
            fontSize : 20,
            beginAtZero: true
          }
        }],
        yAxes: [{
          ticks: {
            fontSize: 20,
            autoSkip: false
          }
        }]
      }
    };

    $scope.rejectionsChartOptions = {
      scales: {
        xAxes: [{
          ticks: {
            fontSize : 20,
            beginAtZero: true
          }
        }],
        yAxes: [{
          ticks: {
            fontSize: 18,
            autoSkip: false
          }
        }]
      }
    };

  // Auto refresh every minute
  autoRefresh = $interval($scope.refresh, 60000);
  $scope.$on('$destroy', function() {
    $interval.cancel(autoRefresh);
  });

  }
]);
