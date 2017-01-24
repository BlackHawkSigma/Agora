var mainAppModuleName = 'paintlineApp';

// var mainAppModule = angular.module(mainAppModuleName, ['ng-route', 'angular-loading-bar']);

var mainAppModule = angular.module(mainAppModuleName, []);

angular.element(document).ready(function() {
  angular.bootstrap(document, [mainAppModuleName]);
});
