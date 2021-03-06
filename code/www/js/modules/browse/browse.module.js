(function() {
  'use strict';

  angular
    .module('gaddum.browse', [
      'ui.router',
      'ngAnimate'
    ])
    .config(function($stateProvider, $urlRouterProvider) {
      $stateProvider
        .state('gaddum.browse', {
          url: '^/browse',
          redirectTo: 'gaddum.browse.list',
          //         virtual: true,
          cache: true
        })
        .state('gaddum.browse.list', {
          cache: false,
          url: '^/browse/list',
          resolve: (['gaddumShortcutBarService',function(gaddumShortcutBarService){
            gaddumShortcutBarService.clearContextMenu();
          }]),
          views: {
            'browse@gaddum': {
              templateUrl:'js/modules/browse/browse.list.html',
              controller:'browseListController',
              controllerAs: 'blc'
            }
          }
        });
    });
})();
