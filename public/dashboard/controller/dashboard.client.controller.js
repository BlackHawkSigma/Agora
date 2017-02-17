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
              || o.verwendung == 'NA';              ;
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
          .chain(bigPartsExclSpare)
          .filter(function(o) {
            return o.verwendung == 'Ausschuss'
              // || o.verwendung == 'NA'
              ;
          })
          .flatMap(function(item) {
            return item.artikeldaten;
          })
          .value();

        var labelsData = _.unzip(defects);
        var data = _.map(labelsData[1], function(n) {
          return _.round(n / $scope.sumInclSpare * 100, 2);
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
        $scope.scrap = summaryInclSpare.Ausschuss / $scope.sumInclSpare * 100;
        $scope.paintScrap = _.sumBy(paintScrap, 'preis') / 1000;

        $scope.defects = defects;
        $scope.defectsChartLabels = labels;
        $scope.defectsChartData = data;
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
            fontSize: 26,
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
            fontSize: 24,
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
