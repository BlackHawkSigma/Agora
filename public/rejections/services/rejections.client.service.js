/* global angular */

angular.module('rejections').factory('Rejections', ['$resource',
  function ($resource) {
    return $resource('/api/rejections', {}, {
      list: {
        method: 'GET'
      }
    })
  }])
