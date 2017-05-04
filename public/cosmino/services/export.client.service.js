/* global angular */

angular.module('cosmino').factory('Export', ['$resource',
  function ($resource) {
    return $resource('/api/export', {}, {
      list: {
        method: 'GET'
      }
    })
  }])
