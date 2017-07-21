/* global angular moment */

angular.module('farbton').controller('FarbtonMessungCtrl', ['$scope', function (scope) {
  scope.init = function () {
    scope.setDefault()
  }

  scope.setDefault = function() {
      scope.from = moment().subtract(1, 'days').toDate()
      if (moment(scope.from).weekday() > 4) {
        scope.from = moment().weekday(4).subtract(1, 'week').toDate()
      }

      scope.to = moment().toDate()
    }

    scope.options = {
      showWeeks: true
    }

}])
