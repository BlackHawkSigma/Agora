angular.module('rejections').controller('RejectionsCtrl', ['$scope', '$filter', 'Rejections',
  function($scope, $filter, Rejections) {
    var defectList = [];

    var articleList = {
      "Tiguan NF Front": 180260000,
      "Tiguan NF Heck": 180630000,
      "Tiguan NF R-Line Front": 181150000,
      "Touran NF Front": 179550000,
      "Touran NF Heck": 179560000,
      "Touran NF R-Line Front": 181460000,
      "Touran NF R-Line Heck": 181440000,
      "Tiguan GP Heck": 163360000,
      "Tiguan GP Front 18°": 163110000,
      "Tiguan GP R-Line Front": 165050000,
      "Tiguan GP Front 28°": 163230000,
      "Amarok GP Front": 183870000
    }

    $scope.artikel = null;
    // Time init
    var endTime = moment().startOf('hour').set('hour', 6).toISOString();
    var startTime = moment(endTime).subtract(1, 'days').toISOString();

    $scope.startTimeInput = new Date(startTime);
    $scope.endTimeInput = new Date(endTime);

    $scope.articleSelection = _.keys(articleList);

    $scope.find = function() {
      var startTimeQuery = moment($scope.startTimeInput).format('YYYY-MM-DD HH:mm:ss');
      var endTimeQuery = moment($scope.endTimeInput).format('YYYY-MM-DD HH:mm:ss');

      Rejections.query({
        'artikel': $scope.artikel,
        'startTime': startTimeQuery,
        'endTime': endTimeQuery
      }, function(data) {
          // Show all datasets
          var articleNames = _.invert(articleList);

          var enrichedData = _
            .forEach(data, function(value) {
              var name = articleNames[value.artikel.typcode];
              _.assign(value, {
                'bezeichnung': name
              })
            })
          $scope.rejections = enrichedData;

          // Refresh displayed dates
          $scope.startTimeDisplay = new Date(startTimeQuery);
          $scope.endTimeDisplay = new Date(endTimeQuery);

          // Fill array with all defects
          defectList = _.flatMap(data, function(item) {
            return item.fehlerart.fehlerart_text;
          });

          // Fill array for defect filter
          $scope.defectSelection = _.uniq(defectList);

          // Defects summary
          $scope.defectsSummary = _.countBy(defectList);

          // Article summary
          $scope.articlesSummary = _
            .chain(data)
            .flatMap(function(item) {
              return item.artikel.typcode;
            })
            .countBy()
            .mapKeys(function(value, key) {
              return articleNames[key];
            })
            .value();

          // Charts
          $scope.updateCharts();

          }, function(err) {
            $scope.err = err;
            });
    };

    // Chart options
    $scope.defectBarOptions = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    };
    $scope.articleBarOptions = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    };

    $scope.updateCharts = function() {
      $scope.defectBarLabels = _.keys($scope.defectsSummary);
      $scope.defectBarData = _.values($scope.defectsSummary);

      $scope.articleBarLabels = _.keys($scope.articlesSummary);
      $scope.articleBarData = _.values($scope.articlesSummary);
    };

    // Filter functions
    $scope.clearDefect = function() {
      $scope.search.fehlerart.fehlerart_text = "";
    };
    $scope.clearArticle = function() {
      $scope.search.bezeichnung = "";
    };
  }
]);
