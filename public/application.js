var mainAppModuleName = 'paintlineApp';

var mainAppModule = angular.module(mainAppModuleName, ['angular-loading-bar', 'ngRoute', 'ngResource', 'cosmino', 'artikel', 'farbton', 'rejections']);

angular.element(document).ready(function() {
  angular.bootstrap(document, [mainAppModuleName]);
});
