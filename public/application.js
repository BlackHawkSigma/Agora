var mainAppModuleName = 'paintlineApp';

var mainAppModule = angular.module(mainAppModuleName, ['angular-loading-bar', 'ngRoute', 'ngResource', 'cosmino', 'rejections', 'dashboard', 'artikel', 'farbton']);

angular.element(document).ready(function() {
  moment.locale('de');
  angular.bootstrap(document, [mainAppModuleName]);
});
