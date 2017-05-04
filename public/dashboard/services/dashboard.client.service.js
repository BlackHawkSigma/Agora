/* global angular */

angular.module('dashboard').factory('Dashboard', ['$resource',
  function ($resource) {
    return $resource('/api/dashboard', {}, {
      list: {
        method: 'GET'
      }
    })
  }
])
