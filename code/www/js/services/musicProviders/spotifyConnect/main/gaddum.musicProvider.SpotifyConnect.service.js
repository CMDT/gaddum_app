(function () {
  'use strict;'

  angular
    .module('gaddum.streaming')
    .factory('gaddumMusicProviderSpotifyConnectService', gaddumMusicProviderSpotifyConnectService);

  gaddumMusicProviderSpotifyConnectService.$inject = [
    '$http',
    'gaddumMusicProviderSpotifyService',
    'ErrorIdentifier'
  ];

  function gaddumMusicProviderSpotifyConnectService(
    $http,
    gaddumMusicProviderSpotifyService,
    ErrorIdentifier
  ) {

    var BASE_POSITION_URI = 'https://api.spotify.com/v1/me/player/currently-playing';
    var BASE_SEEK_TO_URI = 'https://api.spotify.com/v1/me/player/seek';
    var BASE_PLAY_URI = 'https://api.spotify.com/v1/me/player/play?device_id=';
    var BASE_PAUSE_URI = 'https://api.spotify.com/v1/me/player/pause?device_id=';
    var BASE_DEVICES_URI = 'https://api.spotify.com/v1/me/player/devices';

    function unpackDeviceResponse(response) {
      var result = [];
      try {
        var items = response.data.devices;
        items.forEach(function (item) {
          result.push(
            {
              name: item.name,
              type: item.type,
              id: item.id
            }
          );
        });
      } catch (e) {
        // ignore
      }
      return result;
    }

    // https://developer.spotify.com/console/get-users-available-devices/
    function fetchDevices(token) {
      console.log("fetching devices");
      return new Promise(function (resolve, reject) {
        var config = { headers: { 'Authorization': `Bearer ${token}` } };

        // overrides the global http interceptor
        // if the creds have expired, we will get a 401 here,
        // which will mess-up our  process
        config.override = true;
        var searchString = BASE_DEVICES_URI;
        $http.get(encodeURI(searchString), config)
          .then(function (response) {
            var result = unpackDeviceResponse(response);
            resolve(result);
          })
          .catch(function (error) {
            reject(error)
          });
      });
    }














    function unpackSeekToResponse(response) {
      var result = false;

      if (response.status == 204) {
        result = true;
      }

      return result;

    }

    function _asyncSeekTo_ms(token, deviceId, position_ms) {
      return new Promise(
        function (resolve, reject) {
          var config = { headers: { 'Authorization': `Bearer ${token}` } };

          var queryString = `?device_id=${deviceId}&position_ms=${position_ms}`;

          var searchString = BASE_SEEK_TO_URI + queryString;


          $http.put(encodeURI(searchString), {}, config)
            .then(function (response) {
              var result = unpackSeekToResponse(response);
              resolve(result);
            })
            .catch(function (error) {
              reject(error)
            });



        }
      );
    }


    function asyncSeekTo_ms(position_ms) {

      return new Promise(function (
        resolve, reject
      ) {
        _asyncSeekTo_ms(
          CORE.cached_access_credentials.accessToken,
          CORE.cached_device_id,
          position_ms)
          .then(function (result) {
            if (result) {
              _asyncGetPosition(
                CORE.cached_access_credentials.accessToken
              )
                .then(resolve)
                .catch(reject);

            } else {
              reject("could not seek to: " + position_ms);
            }
          })
          .catch(reject);

      });
    }




    function unpackPositionResponse(response) {
      var result = response.data.progress_ms;
      return result;
    }

    function _asyncGetPosition(token) {
      return new Promise(
        function (resolve, reject) {
          var config = { headers: { 'Authorization': `Bearer ${token}` } };

          var searchString = BASE_POSITION_URI;

          $http.get(encodeURI(searchString), config)
            .then(function (response) {
              var result = unpackPositionResponse(response);
              console.log("asyncGetPosition: " + result);
              resolve(result);
            })
            .catch(function (error) {
              reject(error)
            });
        }
      );
    }

    function asyncGetPosition() {
      return new Promise(function (
        resolve, reject
      ) {
        _asyncGetPosition(
          CORE.cached_access_credentials.accessToken)
          .then(
            function (position_ms) {
              CORE.cached_track_position_ms = position_ms;
              resolve(position_ms);
            }
          )
          .catch(reject);

      });
    }

    function unpackPlayResponse(response) {
      var result = false;

      if (response.status == 204) {
        result = true;
      }

      return result;
    }

    function _asyncPause(token, deviceId) {
      return new Promise(
        function (resolve, reject) {
          var config = { headers: { 'Authorization': `Bearer ${token}` } };

          var searchString = BASE_PAUSE_URI + `${deviceId}`;

          $http.put(encodeURI(searchString), {}, config)
            .then(function (response) {
              var result = unpackPlayResponse(response);
              resolve(result);
            })
            .catch(function (error) {
              reject(error)
            });
        }
      );
    }

    function asyncPause() {

      return new Promise(function (
        resolve, reject
      ) {
        _asyncPause(
          CORE.cached_access_credentials.accessToken,
          CORE.cached_device_id)
          .then(resolve)
          .catch(reject);

      });
    }

    function _asyncPlay(token, deviceId, itemUri, position_ms) {
      return new Promise(
        function (resolve, reject) {
          var config = { headers: { 'Authorization': `Bearer ${token}` } };
          var data = {
            uris: [itemUri],
            position_ms: position_ms
          }
          var searchString = BASE_PLAY_URI + `${deviceId}`;

          $http.put(encodeURI(searchString), data, config)
            .then(function (response) {
              var result = unpackPlayResponse(response);
              resolve(result);
            })
            .catch(function (error) {
              reject(error)
            });
        }
      );
    }

    function asyncResume() {
      return new Promise(function (
        resolve, reject
      ) {
        _asyncPlay(
          CORE.cached_access_credentials.accessToken,
          CORE.cached_device_id,
          CORE.current_track_info.getPlayerUri(),
          CORE.cached_track_position_ms
        )

          .then(resolve)
          .catch(reject);
      });
    }

    function asyncPlay(itemUri) {

      return new Promise(function (
        resolve, reject
      ) {
        _asyncPlay(
          CORE.cached_access_credentials.accessToken,
          CORE.cached_device_id,
          itemUri,
          0)
          .then(resolve)
          .catch(reject);
      });
    }


    function findMobileId(items) {

      var result = null;
      if (!!items && items.length > 0) {
        items.forEach(function (item) {

          if (item.type === 'Smartphone') {
            result = item.id;
          }

        });
      }

      return result;

    }


    function asyncGetDeviceId(creds) {
      console.log("asyncPopulateDeviceId");
      return new Promise(function (resolve, reject) {
        var device_id = CORE.cached_device_id;
        if (!device_id) {
          fetchDevices(creds.accessToken)
            .then(
              function (results) {
                device_id = findMobileId(results);
                if (!device_id) {
                  reject("No Spotify Connect on mobile.");
                } else {
                  CORE.cached_device_id = device_id;
                  resolve(creds);
                }
              })
            .catch(reject);
        } else {
          resolve(device_id);
        }
      });
    }

    function asyncIsLoggedIn() {
      return new Promise(function (resolve, reject) {

        gaddumMusicProviderSpotifyService.asyncIsLoggedIn()
          .then(function (isLoggedIn) {
            if (isLoggedIn) {
              asyncGetDeviceId(
                CORE.cached_access_credentials
              )
                .then(
                  function () {
                    resolve(true);
                  }
                )
                .catch(
                  function (error) {
                    reject("check the Spotify App is OK!");
                  }
                );
            } else {
              resolve(false);
            }
          })
          .catch(reject);

      });
    }




    function getCurrentTrackInfo() {
      return CORE.current_track_info;
    }

    function isTrackPlaying() {
      return CORE.track_is_playing;
    }




    function asyncPlayCurrentTrack() {

      CORE.cached_track_position_ms = 0;

      return new Promise(function (resolve, reject) {
        var trackInfo = getCurrentTrackInfo();
        if (trackInfo) {
          if (isTrackPlaying()) {
            asyncPlay(trackInfo.getPlayerUri())
              .then(function () {
                resolve(trackInfo);
              })
              .catch(function (error) {
                ErrorIdentifier.build(
                  ErrorIdentifier.SYSTEM,
                  "failure sending play command");
              });
          } else {
            asyncResume()
              .then(function () {
                resolve(trackInfo);
              })
              .catch(function (error) {
                reject(ErrorIdentifier.build(
                  ErrorIdentifier.SYSTEM,
                  "failure sending resume command"));
              });
          }
        }
      });
    }


    function asyncPauseCurrentTrack() {
      return new Promise(
        function (resolve, reject) {
          asyncPause()
            .then(resolve)
            .catch(function (error) {
              reject(ErrorIdentifier.build(
                ErrorIdentifier.SYSTEM,
                "failure sending pause command"));
            });
        }
      );
    }

    function asyncGetCurrentTrackProgressPercent() {
      return new Promise(
        function (resolve, reject) {
          asyncGetPosition()
            .then(function (position_ms) {
              var duration_ms = getCurrentTrackInfo().duration_ms;

              
              var result = 100; //default is to say track is complete

              if (!!position_ms) {// spotify outputs 0 when the track has completed.
                if (!!duration_ms) {
                  result = position_ms / duration_ms * 100;
                }
              }
              resolve(result);

            })
            .catch(
              function (error) {
                reject(
                  ErrorIdentifier.build(ErrorIdentifier.SYSTEM, "problems getting track progress.")
                );
              });
        });
    }


    function asyncTeardownCurrentTrack() {
      return new Promise(
        function (resolve, reject) {
          CORE.track_is_playing = false;
          var trackInfo = CORE.current_track_info;
          CORE.current_track_info = null;
          asyncPause()
            .then(
              function () {
                asyncSeekTo_ms(trackInfo.duration_ms)
                  .then(resolve)
                  .catch(
                    function (error) {
                      reject(
                        ErrorIdentifier.build(ErrorIdentifier.SYSTEM, "problems seeking to end of track")
                      );
                    });
              }
            )
            .catch(
              function (error) {
                reject(
                  ErrorIdentifier.build(ErrorIdentifier.SYSTEM, "problems pausing, prior to track teardown.")
                );
              });
        });
    }


    var CORE = gaddumMusicProviderSpotifyService.CORE; // naughtiness, allowing us access to private variables
    var service = {

      // ------ new implementation, using online connect facility.
      asyncIsLoggedIn: asyncIsLoggedIn,
      asyncPlayCurrentTrack: asyncPlayCurrentTrack,
      asyncPauseCurrentTrack: asyncPauseCurrentTrack,
      asyncGetCurrentTrackProgressPercent, asyncGetCurrentTrackProgressPercent,
      asyncTeardownCurrentTrack: asyncTeardownCurrentTrack,


      // ------ pass-throughs to the oroginal service

      asyncLogin: gaddumMusicProviderSpotifyService.asyncLogin,
      asyncLogout: gaddumMusicProviderSpotifyService.asyncLogout,
      asyncInitialise: gaddumMusicProviderSpotifyService.asyncInitialise,
      asyncGetSupportedSearchModifiers: gaddumMusicProviderSpotifyService.asyncGetSupportedSearchModifiers,
      asyncGetSupportedGenres: gaddumMusicProviderSpotifyService.asyncGetSupportedGenres,
      asyncSetGenres: gaddumMusicProviderSpotifyService.asyncSetGenres,
      asyncGetGenres: gaddumMusicProviderSpotifyService.asyncGetGenres,

      asyncGetSupportedSearchModifier: gaddumMusicProviderSpotifyService.asyncGetSupportedSearchModifier,
      asyncSeekTracks: gaddumMusicProviderSpotifyService.asyncSeekTracks,
      asyncSuggestTracks: gaddumMusicProviderSpotifyService.asyncSuggestTracks,

      asyncGetProfilePlaylist: gaddumMusicProviderSpotifyService.asyncGetProfilePlaylist,
      asyncImportPlaylists: gaddumMusicProviderSpotifyService.asyncImportPlaylists,
      asyncImportTracks: gaddumMusicProviderSpotifyService.asyncImportTracks,

      asyncSetTrack: gaddumMusicProviderSpotifyService.asyncSetTrack,
      getCurrentTrack: gaddumMusicProviderSpotifyService.getCurrentTrack,






    };







    return service;
  }
})();
