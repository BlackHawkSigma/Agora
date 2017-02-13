var mainAppModuleName = 'paintlineApp';

var mainAppModule = angular.module(mainAppModuleName, ['angular-loading-bar', 'ngRoute', 'ngResource', 'cosmino', 'artikel', 'farbton', 'rejections', 'dashboard']);

angular.element(document).ready(function() {
  moment.locale('de');
  angular.bootstrap(document, [mainAppModuleName]);
});
