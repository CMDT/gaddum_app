(function () {
  'use strict';


  angular
    .module('gaddum.streaming')
    .factory('gaddumMusicProviderService', gaddumMusicProviderService);

  gaddumMusicProviderService.$inject = [

    '$injector',
    '$timeout',
    '$q',
    'dataApiService',
    'MusicProviderIdentifier',
    'EventIdentifier',
    '$rootScope',
    'allSettingsService',
    'TrackProgress'
  ];

  function gaddumMusicProviderService(

    $injector,
    $timeout,
    $q,
    dataApiService,
    MusicProviderIdentifier,
    EventIdentifier,
    $rootScope,
    allSettingsService,
    TrackProgress
  ) {

    // vars
    var MUSIC_PROVIDER = null;
    var MUSIC_PROVIDER_IDENTIFIER = null;
    var LOGIN_HANDLER_PROMISE = null;
    var EVENT_HANDLER_PROMISE = null;
    var IS_LOGGED_IN = null;
    var PROGRESS_WARNING_LIMIT_PERCENT = 0;

    var SETTINGS = {
      MAX_TRACK_DURATION_FOR_SKIP_S: {
        id: 'track_selector_max_track_duration_for_skip_s',
        value: 0
      }
    };



    function asyncUpdateFromSettings() {
      var deferred = $q.defer();
      var promises = [];

      $timeout(

        function () {
          promises.push(allSettingsService.asyncGet(SETTINGS.MAX_TRACK_DURATION_FOR_SKIP_S.id));

          $q.all(promises).then(
            function (results) {
              SETTINGS.MAX_TRACK_DURATION_FOR_SKIP_S.value = results[0];
            },
            deferred.reject
          );

          deferred.resolve();
        }
      );


      return deferred.promise;
    }



    function asyncBroadcastEvent(event) {
      var deferred = $q.defer();

      $timeout(

        function () {
          if (EVENT_HANDLER_PROMISE) {
            EVENT_HANDLER_PROMISE(event).then(
              deferred.resolve,
              deferred.reject
            );
          }
        }

      );


      return deferred.promise;
    }


    function asyncHandleLogin() {
      var deferred = $q.defer();

      $timeout(

        function () {
          if (LOGIN_HANDLER_PROMISE) {
            LOGIN_HANDLER_PROMISE().then(
              deferred.resolve,
              deferred.reject
            );
          }
        }

      );


      return deferred.promise;
    }



    function handleLoginUpdate(loggedIn) {
      if (IS_LOGGED_IN != loggedIn) {

        if (loggedIn) {
          asyncBroadcastEvent(
            EventIdentifier.build(
              EventIdentifier.LOGGED_IN
            ));
        } else {
          asyncBroadcastEvent(
            EventIdentifier.build(
              EventIdentifier.LOGGED_OUT
            ));
        }
        IS_LOGGED_IN = loggedIn;
      }
    }

    function onLoginNotNeeded() {
      var deferred = $q.defer();
      $timeout(
        function () {
          deferred.resolve();
        }
      );
      return deferred.promise;
    }


    function asyncPromptIfLoginNeeded(loggedIn) {
      if (loggedIn) {
        return onLoginNotNeeded();
      } else {
        return asyncHandleLogin();
      }
    }

    // will force a login if one is required
    function asyncCheckForLoginPromptIfNeeded() {
      return asyncIsLoggedIn().then(asyncPromptIfLoginNeeded)
    }


    function asyncGetSupportedMusicProviders() {
      var deferred = $q.defer();


      dataApiService.asyncGetSupportedMusicProviders().then(
        function onSuccess(items) {
          var results = [];
          if (items && items.length > 0) {

            items.forEach(function (item) {
              results.push(MusicProviderIdentifier.buildFromObject(item));
            });

            deferred.resolve(results);
          } else {
            deferred.reject(ErrorIdentifier.build(ErrorIdentifier.SYSTEM, "no music providers found!"));
          }
        },
        function onFail(error) {
          deferred.reject(ErrorIdentifier.build(ErrorIdentifier.SYSTEM, "error looking for music providers: " + error.message));
        }
      );


      return deferred.promise;
    }

    function asyncSetMusicProvider(musicProviderIdentifier) {
      // dynamic injection: see http://next.plnkr.co/edit/iVblEU?p=preview&utm_source=legacy&utm_medium=worker&utm_campaign=next&preview, https://stackoverflow.com/questions/13724832/angularjs-runtime-dependency-injection

      var deferred = $q.defer();
      MUSIC_PROVIDER_IDENTIFIER = musicProviderIdentifier;
      MUSIC_PROVIDER = $injector.get(musicProviderIdentifier.getId());

      dataApiService.asyncSetSelectedMusicProvider(musicProviderIdentifier).then(
        function () {
          console.log("initialising music provider: " + musicProviderIdentifier.getName());
          MUSIC_PROVIDER.asyncInitialise(musicProviderIdentifier, asyncBroadcastEvent).then(
            deferred.resolve,
            deferred.reject
          );
        },
        deferred.reject

      );


      return deferred.promise;
    }


    function getMusicProvider() {
      return MUSIC_PROVIDER_IDENTIFIER;
    }



    function asyncGetMusicProvider() {

      var deferred = $q.defer();

      $timeout(

        function () {
          if (MUSIC_PROVIDER_IDENTIFIER) {
            deferred.resolve(MUSIC_PROVIDER_IDENTIFIER);
          } else {
            dataApiService.asyncGetSelectedMusicProvider().then(
              function (result) {
                deferred.resolve(result);
              }
              ,
              deferred.reject
            );
          }
        }

      );



      return deferred.promise;
    }

    function asyncGetSupportedSearchModifier() {
      return asyncCheckForLoginPromptIfNeeded().then(
        function () {
          return MUSIC_PROVIDER.asyncGetSupportedSearchModifier();
        });
    }



    function asyncLogin() {
      var promise = null;

      if (MUSIC_PROVIDER) {
        promise = MUSIC_PROVIDER.asyncLogin();
      } else {
        var deferred = $q.defer();
        promise = deferred.promise;
        deferred.reject(ErrorIdentifier.build(ErrorIdentifier.SYSTEM, "call setSupportedServiceProvider before attempting to login."));
      }
      return promise;

    }

    function asyncIsLoggedIn() {
      var deferred = $q.defer();

      $timeout(
        function () {
          if (MUSIC_PROVIDER) {
            MUSIC_PROVIDER.asyncIsLoggedIn().then(

              function (loggedIn) {
                handleLoginUpdate(loggedIn);
                deferred.resolve(loggedIn);
              },
              function (erro) {
                handleLoginUpdate(false);
                deferred.resolve(false);
              }

            );
          } else {
            handleLoginUpdate(false);
            deferred.resolve(false);
          }
        });


      return deferred.promise;
    }

    function asyncLogout() {

      return new Promise(function(resolve, reject){

        if(!!MUSIC_PROVIDER){
          MUSIC_PROVIDER.asyncTeardownCurrentTrack()
          .then(function(){
            MUSIC_PROVIDER.asyncLogout()
            .then(resolve)
            .catch(resolve);
          })
          .catch(
            function(){
              MUSIC_PROVIDER.asyncLogout()
              .then(resolve)
              .catch(resolve);
            });
        }else{
          resolve();
        }

      });




    }

    function asyncSuggestTracks(genres, moodId, limit) {
      return asyncCheckForLoginPromptIfNeeded().then(
        function () {
          return MUSIC_PROVIDER.asyncSuggestTracks(genres, moodId, limit);
        });
    }


    function asyncSeekTracks(searchTerm, trackSearchCriteria, limit, page) {
      return asyncCheckForLoginPromptIfNeeded().then(
        function () {
          return MUSIC_PROVIDER.asyncSeekTracks(searchTerm, trackSearchCriteria, limit, page);
        });
    }

    function asyncTearDownCurrentTrack() {
      var deferred = $q.defer();
      stopPositionPolling();
      MUSIC_PROVIDER.asyncTeardownCurrentTrack().then(
        deferred.resolve,
        deferred.reject
      );
      return deferred.promise;
    }

    function asyncTearDownIfRequired() {
      var deferred = $q.defer();
      $timeout(
        function () {
          if (MUSIC_PROVIDER.getCurrentTrack()) {
            asyncTearDownCurrentTrack().then(
              deferred.resolve
              ,
              deferred.reject
            );
          } else {
            deferred.resolve();
          }
        });



      return deferred.promise;
    }

    function calculateProgressWarningPercent(trackDuration_ms, warningDuration_ms){
      var result = 0;
      try{
        result = warningDuration_ms * 100 / trackDuration_ms;
      }catch(error){} // ignore if data is bad.
      return result;
    }


    function asyncSetTrack(genericTrack) {
      var deferred = $q.defer();
      asyncCheckForLoginPromptIfNeeded().then(
        function () {
          asyncTearDownIfRequired().then(
            function () {
              if (genericTrack) {
                PROGRESS_WARNING_LIMIT_PERCENT = calculateProgressWarningPercent(genericTrack.getDuration_ms(), SETTINGS.MAX_TRACK_DURATION_FOR_SKIP_S.value * 1000);
                MUSIC_PROVIDER.asyncSetTrack(genericTrack).then(
                  function (trackInfo) {
                    var eventCode = EventIdentifier.TRACK_NOT_FOUND;
                    if (trackInfo) {
                      eventCode = EventIdentifier.TRACK_NEW;
                    }
                    asyncBroadcastEvent(
                      EventIdentifier.build(eventCode, trackInfo));
                    deferred.resolve(trackInfo);
                  },
                  deferred.reject
                );
              } else {
                deferred.resolve(null);
              }
            },
            deferred.reject
          );
        },
        deferred.reject
      )
      return deferred.promise;
    }

    var POLLING = false;
    var POLL_UPDATE_TIME_MS = 1000;

    function asyncPollAndBroadcast() {
      var deferred = $q.defer();
      MUSIC_PROVIDER.asyncGetCurrentTrackProgressPercent().then(
        function onProgress(percent) {
          console.log("asyncPollAndBroadcast: onProgress: percent " + percent);
          if (percent == 0) {
            POLLING = false;
          } else {
            if (percent > 0) {
              asyncBroadcastEvent(
                EventIdentifier.build(EventIdentifier.TRACK_PROGRESS_PERCENT, TrackProgress.build(percent,PROGRESS_WARNING_LIMIT_PERCENT))
              );
            }
            if (percent == 100) {
              asyncBroadcastEvent(
                EventIdentifier.build(EventIdentifier.TRACK_PROGRESS_PERCENT, TrackProgress.build(percent,PROGRESS_WARNING_LIMIT_PERCENT))
              ).then(
                function () {
                  asyncBroadcastEvent(
                    EventIdentifier.build(EventIdentifier.TRACK_END)
                  ).then(
                    function () {
                      asyncTearDownCurrentTrack();
                    });
                }
              );
            }
          }
        },
        function onError() {
          POLLING = false;
        }
      );

      return deferred.promise;
    }

    function doPollAndRepeat() {
      if (POLLING) {
        asyncPollAndBroadcast().then(
          $timeout(
            function () {
              doPollAndRepeat();
            }, POLL_UPDATE_TIME_MS
          )
        );
      }
    }

    function startPositionPolling() {
      if (!POLLING) {
        POLLING = true;
        doPollAndRepeat();
      }
    }

    function stopPositionPolling() {
      POLLING = false;
    }





    function asyncPlayCurrentTrack() {
      var deferred = $q.defer();

      asyncCheckForLoginPromptIfNeeded().then(
        function () {
          MUSIC_PROVIDER.asyncPlayCurrentTrack().then(
            function onSuccess() {
              console.log("starting polling...");
              startPositionPolling();

              deferred.resolve(true);
            },
            function onError() {
              stopPositionPolling();
              asyncBroadcastEvent(
                EventIdentifier.build(EventIdentifier.TRACK_ERROR, "Problem with playing the track. Does your account allow you to play tracks?")
              );
              deferred.reject();
            }
          )
        },
        deferred.reject
      );

      return deferred.promise;
    }

    function asyncPauseCurrentTrack() {
      return asyncCheckForLoginPromptIfNeeded().then(
        MUSIC_PROVIDER.asyncPauseCurrentTrack().then(
          stopPositionPolling,
          stopPositionPolling
        )
      );
    }





    function asyncGetProfilePlaylist(offset, limit) {
      return asyncCheckForLoginPromptIfNeeded().then(function () {
        return MUSIC_PROVIDER.asyncGetProfilePlaylist(offset, limit);
      });
    }

    function asyncImportPlaylists(playlists) {
      return asyncCheckForLoginPromptIfNeeded().then(function () {
        return MUSIC_PROVIDER.asyncImportPlaylists(playlists);
      });
    }

    function asyncImportTracks(tracks) {
      return MUSIC_PROVIDER.asyncImportTracks(tracks);
    }

    function asyncGetTrackInfo(genericTrack) {
      return asyncCheckForLoginPromptIfNeeded().then(
        function () {
          return MUSIC_PROVIDER.asyncGetTrackInfo(genericTrack);
        });
    }


    function asyncGetSupportedGenres() {
      return asyncCheckForLoginPromptIfNeeded().then(
        function () {
          return MUSIC_PROVIDER.asyncGetSupportedGenres();
        });
    }

    function asyncSetGenres(genres) {
      return asyncCheckForLoginPromptIfNeeded().then(
        function () {
          return MUSIC_PROVIDER.asyncSetGenres(genres);
        });
    }

    function asyncGetGenres() {
      return asyncCheckForLoginPromptIfNeeded().then(
        function () {
          return MUSIC_PROVIDER.asyncGetGenres();
        });
    }

    function asyncInitialise(returnsALoginPromise, returnsAnEventHandlingPromise) {


      MUSIC_PROVIDER = null;
      MUSIC_PROVIDER_IDENTIFIER = null;
      LOGIN_HANDLER_PROMISE = null;
      EVENT_HANDLER_PROMISE = null;
      IS_LOGGED_IN = null;


      var deferred = $q.defer();
      if (returnsALoginPromise) {
        LOGIN_HANDLER_PROMISE = returnsALoginPromise;
      } else {
        throw (ErrorIdentifier.build(ErrorIdentifier.SYSTEM, "Music Provider Service needs a function returning a promise which will handle the update of its access credentials, calling MusicProviderService.asyncLogin()"))
      }

      if (returnsAnEventHandlingPromise) {
        EVENT_HANDLER_PROMISE = returnsAnEventHandlingPromise;
      } else {
        throw (ErrorIdentifier.build(ErrorIdentifier.SYSTEM, "Music Provider Service needs a function returning a promise which will handle events fro the provider. See EventIdentifier"))
      }

      asyncUpdateFromSettings().then(
        function () {
          asyncGetMusicProvider().then(
            function (musicProviderIdentifier) {
              if (musicProviderIdentifier) {
                asyncSetMusicProvider(musicProviderIdentifier).then(
                  deferred.resolve,
                  deferred.reject
                );
              } else {
                deferred.resolve(null);
              }
            },
            deferred.reject
          );
        },
        deferred.reject

      );



      return deferred.promise
    };

    var service = {


      // funcs
      asyncInitialise: asyncInitialise,
      asyncUpdateFromSettings: asyncUpdateFromSettings,
      asyncGetSupportedMusicProviders: asyncGetSupportedMusicProviders,
      asyncSetMusicProvider: asyncSetMusicProvider,
      getMusicProvider: getMusicProvider,
      asyncLogin: asyncLogin,
      asyncIsLoggedIn: asyncIsLoggedIn,
      asyncLogout: asyncLogout,

      asyncSeekTracks: asyncSeekTracks,
      asyncSuggestTracks: asyncSuggestTracks,

      asyncSetTrack: asyncSetTrack,
      asyncPlayCurrentTrack: asyncPlayCurrentTrack,
      asyncPauseCurrentTrack: asyncPauseCurrentTrack,


      asyncGetSupportedGenres: asyncGetSupportedGenres,
      asyncSetGenres: asyncSetGenres,
      asyncGetGenres: asyncGetGenres,
      asyncGetSupportedSearchModifier: asyncGetSupportedSearchModifier,

      asyncGetProfilePlaylist: asyncGetProfilePlaylist,
      asyncImportTracks: asyncImportTracks,
      asyncImportPlaylists: asyncImportPlaylists,
      asyncGetTrackInfo: asyncGetTrackInfo

    };





    return service;

  }

})();
