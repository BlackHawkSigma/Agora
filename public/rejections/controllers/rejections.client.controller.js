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
    $scope.startTime = '2017-02-08';
    $scope.endTime = _.now();

    // For future use...
    // $scope.articleSelection = _.keys(articleList);

    $scope.articleSelection = [
      'Touran',
      'Tiguan',
      'Amarok'
    ];

    $scope.find = function() {
      Rejections.query({
        'artikel': $scope.artikel,
        'startTime': $scope.startTime
      }, function(data) {
          // Show all datasets
          $scope.rejections = data;

          // Fill array with all defects
          defectList = _.flatMap(data, function(item) {
            return item.fehlerart.fehlerart_text;
          });

          // Fill array for defect filter
          $scope.defectSelection = _.uniq(defectList);

          // Defects summary
          $scope.defectsSummary = _.countBy(defectList);

          // Article summary
          var articleNames = _.invert(articleList);

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

          }, function(err) {
            $scope.err = err;
            });
    };

    $scope.clearDefect = function() {
      $scope.search.fehlerart.fehlerart_text = "";
    };
    $scope.clearArticle = function() {
      $scope.search.artikel.artikelbezeichnung = "";
    };
  }
]);
