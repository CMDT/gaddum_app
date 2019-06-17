// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', [
  'ionic',
  'ngTouch',
  'gaddum.player',
  'gaddum.playermenu',
  'emotionReader',
  'main_ui',
  'profile',
  'groups',
  'friends',
  'messages',
  'playlists',
  'gifts',
  'browse',
  'mood'
//  'momentjs', // ADDED used for dates
//  'eventsjs'  // ADDED our events module
])
  .run(['$ionicPlatform','$state','$timeout','$rootScope','$ionicSlideBoxDelegate',function ($ionicPlatform, $state,$timeout , $rootScope, $ionicSlideBoxDelegate) {
    $rootScope.$on('slideChanged', function(a) {
      console.log("slideChanged - ",a);
      console.log("  slide now ",$ionicSlideBoxDelegate.currentIndex());
      $timeout(function (){
        console.log("timeout jump!");
        var stateToGoTo = /*"/" +*/ $($("#main_wrapper").find("ion-slide")[parseInt($ionicSlideBoxDelegate.currentIndex())]).data("state");
        $state.transitionTo( stateToGoTo ).then(
          function(a){
            console.log("okay",a);
          },function(e){
            console.log("error",e);
          }//  ,{},{notify:false});
        );
      },1);
    });
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      console.log('$stateChangeStart to ' + toState.to + '- fired when the transition begins. toState,toParams : \n', toState, toParams);
    });
    $ionicPlatform.ready(function ($state) {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
      // ADDED START
      $state.go("mood");
      // ADDED END

    });
  }]);
