var mainAppModuleName = 'paintlineApp';

var mainAppModule = angular.module(mainAppModuleName, ['angular-loading-bar', 'cosmino']);

angular.element(document).ready(function() {
  angular.bootstrap(document, [mainAppModuleName]);
});
