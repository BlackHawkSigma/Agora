/* global angular moment */

var mainAppModuleName = 'paintlineApp'

angular.module(mainAppModuleName, ['angular-loading-bar', 'ngRoute', 'ngResource', 'cosmino', 'rejections', 'dashboard', 'artikel', 'farbton', 'tools_robStatus'])

angular.element(document).ready(function () {
  moment.locale('de')
  angular.bootstrap(document, [mainAppModuleName])
})
