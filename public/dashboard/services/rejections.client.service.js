angular.module('dashboard').factory('Rejections', ['$resource',
  function($resource) {
    return $resource('/api/rejections', {}, {
      list: {
        method: 'GET'
      }
    });
  }
]);
