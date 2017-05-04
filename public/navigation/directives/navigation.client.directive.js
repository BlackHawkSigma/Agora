/* global angular */

angular.module('paintlineApp').directive('navigation',
  function (routeNavigation) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'navigation/views/navigation-directive.tpl.html',
      controller: function ($scope) {
        $scope.routes = routeNavigation.routes
        $scope.activeRoute = routeNavigation.activeRoute
      }
    }
  })
