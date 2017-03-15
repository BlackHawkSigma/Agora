angular.module('tools_robStatus').factory('Tools', ['$resource',
  function($resource) {
    return $resource('/api/tools/robStatus')
  }
])
