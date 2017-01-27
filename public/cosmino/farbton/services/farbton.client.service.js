angular.module('farbton').factory('Farbton', ['$resource',
function($resource) {
  return $resource('/api/farbton', {}, {
    list: {
      method: 'GET'
    }
  });
}]);
