angular.module('artikel').factory('Artikel', ['$resource',
function($resource) {
  return $resource('/artikel', {}, {
    list: {
      method: 'GET'
    }
  });
}]);
