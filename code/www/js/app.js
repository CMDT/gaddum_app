// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var startState = 'gaddum.profile';

angular.module('gaddum', [
  'ionic',
  'momentjs',
  'app.startup',
  'ngTouch',
  'utilitiesjs',
  'dataapijs',
  'authenticatejs',
  'app.db',
  'gaddum.publishandsubscribe',
  'gaddum.models',
  'gaddum.player',
  'gaddum.playermenu',
  'gaddum.streaming',
  'gaddum.main_ui',
  'gaddum.profile',
  'gaddum.groups',
  'gaddum.friends',
  'gaddum.messages',
  'gaddum.playlists',
  'gaddum.gifts',
  'gaddum.browse',
  'gaddum.mood',
  'gaddum.login',
  'gaddum.selector',
  'modalsProfile',
  'gaddum.profileDirective',
  'gaddum.settings',
  'gaddum.permissions',
  'gaddum.shortcutBar',
  'editImageModalModule',
  'genresCheckboxModalsModule',
  'gaddum.searchCat',
  'gaddum.userprofiler',
  'gaddum.alert',
  'playlistViewModule',
  'playlistEditModule',
  'gaddum.playlistDirective',
  'gaddum.location',
  'gaddum.postcode',
  'gaddum.observer',
  'gaddum.spinner',
  'gaddum.intelligenttrackselector',
  'gaddum.userprofiler',
  'gaddum.time',
  'gaddum.connection',
  'playlistCreateModule',
  //'gaddum.httpInterceptor',
  'FriendsAddFriendModule',
  'push',
  'gaddum.newMessageIcon',
  'openMessageModalModule',
  'gaddum.share',
  'gaddum.send'
])
  .run([
    '$ionicPlatform',
    '$state',
    '$rootScope',
    '$ionicSlideBoxDelegate',
    '$window',
    '$q',
    'pubsubService',
    'startupSrvc',
    'moodService',
    'loginModal',
    'gaddumMusicProviderService',
    'connectionService',
    'userProfilerService',
    'permissionsService',
    'permissionsListenerService',
    'playerService',
    'observerService',
    'timeService',
    'EventIdentifier',
    'messagingService',
    function (
      $ionicPlatform,
      $state,
      $rootScope,
      $ionicSlideBoxDelegate,
      $window,
      $q,
      pubsubService,
      startupSrvc,
      moodService,
      loginModal,
      gaddumMusicProviderService,
      connectionService,
      userProfilerService,
      permissionsService,
      permissionsListenerService,
      playerService,
      observerService,
      timeService,
      EventIdentifier,
      messagingService
    ) {

      $rootScope.$on('slideChanged', function (a) {
        var stateToGoTo = "gaddum." + $($("#main_wrapper").find("ion-slide")[parseInt($ionicSlideBoxDelegate.currentIndex())]).data("state");
        $('input[type=text], textarea').blur(); // deselect all input items!
        $state.transitionTo(stateToGoTo, {}, { notify: true }); // notify seems to overwrite the views
      });

      $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        // update the slider delegate - is there a matching slide name?
        //     console.log("stateChangeStart", toState);

        if (toState.name != "startup_permissions" && toState.name != "startup_frontpage") {
          var baseStateName = toState.name.split(".")[1];
          if (angular.isDefined(baseStateName) === true) {
            var sliderState = false;
            $($("#main_wrapper").find("ion-slide")).each(function (i) {
              if ($($("#main_wrapper").find("ion-slide")[i]).data("state") === baseStateName) {
                // these *is* a matching slide for this state change
                $ionicSlideBoxDelegate.slide(i);
                $rootScope.currentSlide = i;
                $rootScope.totalSlides = $('#main_wrapper').find("ion-slide").length;

                $state.go("gaddum." + baseStateName, {}, { reload: true, notify: false });
              }
            });
          }
        }
      });

      $rootScope.$on('$stateChangeError', function (err, toState, toParams, fromState, fromParams) {
        console.log('⚠️$stateChangeError!! ' + toState.to + '- : \n', err, toState, toParams);
      });

      $ionicPlatform.ready(function () {

        //['$state','$statusBar','$window',function ($state,$statusBar,$window) {
        if ($window.cordova && $window.cordova.plugins.Keyboard) {
          // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
          // for form inputs)
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

          // Don't remove this line unless you know what you are doing. It stops the viewport
          // from snapping when text inputs are focused. Ionic handles this internally for
          // a much nicer keyboard experience.
          cordova.plugins.Keyboard.disableScroll(true);
        }
        if ($window.StatusBar) {
          StatusBar.styleDefault();
        }

        function asyncStart() {
          var deferred = $q.defer();


          // --- all player events can be subscribed to
          pubsubService.subscribe(
            'playerEvent', playerService.promiseHandleEvent
          );


          //-- registering the observer to update when there is a change to user settings.
          pubsubService.subscribe(
            // this event is published when the settings UI has completed. See the main menu. 
            'userSettingChange', observerService.asyncUpdateFromSettings
          );

          //-- registering the userProfiler to update when there is a change to user settings.
          pubsubService.subscribe(
            // this event is published when the settings UI has completed. See the main menu. 
            'userSettingChange', userProfilerService.asyncUpdateFromSettings
          );

          //-- registering the moodService to update when there is a change to user settings.
          pubsubService.subscribe(
            // this event is published when the settings UI has completed. See the main menu. 
            'userSettingChange', moodService.asyncUpdateFromSettings
          );

          //-- registering the musicProviderService to update when there is a change to user settings.
          pubsubService.subscribe(
            // this event is published when the settings UI has completed. See the main menu. 
            'userSettingChange', gaddumMusicProviderService.asyncUpdateFromSettings
          );

         messagingService.initialise().then(function(d){
           console.log("app.js: messagingService.initialised with return of ",d);
         }); 

          // -- the connection service warns the player when there is a change in conneciton state.
          // -- note: hasWifi is very useful: users may not want to use when on cellular.
          connectionService.initialise(
            function onConnectionChange() {
              var eventType = EventIdentifier.INTERNET_DOWN;
              var payload = null;
              if (connectionService.hasConnection()) {
                eventType = EventIdentifier.INTERNET_UP;
                payload = {
                  hasWifi: connectionService.isWifi()
                };
              }
              var event = EventIdentifier.build(eventType, payload);
              pubsubService.asyncPublish('playerEvent', event);
            }
          );

          startupSrvc.asyncInitialise()
            .then(
              function () {
                timeService.asyncInitialise()
                  .then(
                    function () {
                      gaddumMusicProviderService.asyncInitialise(
                        loginModal.promiseLogin,
                        function (event) {
                          return pubsubService.asyncPublish('playerEvent', event);
                        }
                      )
                        .then(
                          function () {
                            observerService.asyncInitialise()
                              .then(
                                function () {
                                  userProfilerService.asyncInitialise(
                                    function onChange() {
                                      return pubsubService.asyncPublish(
                                        'playerEvent',
                                        EventIdentifier.build(EventIdentifier.PLAYLIST_NEW)
                                      );
                                    })
                                    .then(
                                      function () {
                                        messagingService.initialise()
                                          .then(
                                            function(){
                                              moodService.asyncInitialise()
                                                .then(
                                                  function () {
                                                    permissionsListenerService.initialise(null);
                                                    $state.go('gaddum.playlists');
                                                    deferred.resolve();
                                                  },
                                                  deferred.reject
                                                );
                                            },
                                            deferred.reject
                                          );
                                      },
                                      deferred.reject
                                    );
                                },
                                deferred.reject
                              );
                          },
                          deferred.reject
                        );
                    },
                    deferred.reject
                  );
              },
              deferred.reject
            );

          return deferred.promise;
        }



        permissionsService.returnPermissions().then(
          function (response) {
            if (response.hasAllRequiredPermissions) {
              asyncStart();
            } else {
              // The main page contains a directive which automatically 
              // pops up when permissions are needed we listen for its completion here.
              // we defer starting until this has completed
              permissionsListenerService.initialise(
                function onPermissionsGranted() {
                  asyncStart();
                });
            }
          }
        );

      }/*]*/);

    }]);
