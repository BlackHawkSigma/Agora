/* global angular moment _ */

angular.module('rejections').controller('RejectionsCtrl', ['$scope', '$filter', 'Rejections',
  function ($scope, $filter, Rejections) {
    var defectList = []

    var articleList = {
      'Tiguan NF Front': 180260000,
      'Tiguan NF Heck': 180630000,
      'Tiguan NF R-Line Front': 181150000,
      'Touran NF Front': 179550000,
      'Touran NF Heck': 179560000,
      'Touran NF R-Line Front': 181460000,
      'Touran NF R-Line Heck': 181440000,
      'Tiguan GP Heck': 163360000,
      'Tiguan GP Front 18°': 163110000,
      'Tiguan GP R-Line Front': 165050000,
      'Tiguan GP Front 28°': 163230000,
      'Amarok GP Front': 183870000,
      'Amarok GP Radabd. vorne links': 168500000,
      'Amarok GP Radabd. vorne rechts': 168501000,
      'Amarok GP Radabd. hinten links': 183950000,
      'Amarok GP Radabd. hinten rechts': 183951000,
      "Amarok GP Verbr. vorne links": 183940000,
      "Amarok GP Verbr. vorne rechts": 183941000
    }

    $scope.artikel = null
    // Time init
    var endTime = moment().startOf('hour').set('hour', 6).toISOString()
    var startTime = moment(endTime).subtract(1, 'days').toISOString()

    $scope.startTimeInput = new Date(startTime)
    $scope.endTimeInput = new Date(endTime)

    $scope.articleSelection = _.keys(articleList)

    $scope.find = function () {
      var startTimeQuery = moment($scope.startTimeInput).format('YYYY-MM-DD HH:mm:ss')
      var endTimeQuery = moment($scope.endTimeInput).format('YYYY-MM-DD HH:mm:ss')

      Rejections.query({
        'artikel': $scope.artikel,
        'startTime': startTimeQuery,
        'endTime': endTimeQuery
      }, function (data) {
          // Show all datasets
        var articleNames = _.invert(articleList)

        var enrichedData = _
            .forEach(data, function (value) {
              var name = articleNames[value.artikel.typcode]
              var day = moment(value.datum).subtract(6, 'hours').format('DD.MM.YY')
              _.assign(value, {
                'bezeichnung': name,
                'date': day
              })
            })
        $scope.rejections = enrichedData

          // Test
        var groupedData = _
            .chain(enrichedData)
            .groupBy('date')
            .value()

        _.each(groupedData, function (value, key) {
          groupedData[key] = _.groupBy(groupedData[key], 'bezeichnung')
          _.each(groupedData[key], function (innerValue, innerKey) {
            groupedData[key][innerKey] = _.countBy(innerValue, 'fehlerart.fehlerart_text')
          })
        })

        $scope.groupedData = groupedData
        console.log(groupedData)

          // Refresh displayed dates
        $scope.startTimeDisplay = new Date(startTimeQuery)
        $scope.endTimeDisplay = new Date(endTimeQuery)

          // Fill array with all defects
        defectList = _.flatMap(data, function (item) {
          return item.fehlerart.fehlerart_text
        })

          // Fill array for defect filter
        $scope.defectSelection = _.uniq(defectList)

          // Defects summary
        $scope.defectsSummary = _
            .chain(defectList)
            .countBy()
            .entries()
            .sortBy(function (a) {
              return a[1]
            })
            .reverse()
            .unzip()
            .value()

          // Article summary
        $scope.articlesSummary = _
            .chain(data)
            .flatMap(function (item) {
              return item.artikel.typcode
            })
            .countBy()
            .mapKeys(function (value, key) {
              return articleNames[key]
            })
            .entries()
            .sortBy(function (a) {
              return a[1]
            })
            .reverse()
            .unzip()
            .value()

          // Charts
        $scope.updateCharts()
      }, function (err) {
        $scope.err = err
      })
    }

    // Chart options
    $scope.defectBarOptions = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
    $scope.articleBarOptions = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }

    $scope.updateCharts = function () {
      $scope.defectBarLabels = $scope.defectsSummary[0]
      $scope.defectBarData = $scope.defectsSummary[1]

      $scope.articleBarLabels = $scope.articlesSummary[0]
      $scope.articleBarData = $scope.articlesSummary[1]
    }

    // Filter functions
    $scope.clearDefect = function () {
      $scope.search.fehlerart.fehlerart_text = ''
    }
    $scope.clearArticle = function () {
      $scope.search.bezeichnung = ''
    }
    $scope.clearVerwendung = function () {
      $scope.search.verwendung = ''
    }
  }
])
