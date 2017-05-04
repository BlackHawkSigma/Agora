/* global angular */

angular.module('artikel').factory('Artikel', ['$resource',
  function ($resource) {
    return $resource('/api/artikel', {}, {
      list: {
        method: 'GET'
      }
    })
  }])
