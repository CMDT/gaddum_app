(function () {
  'use strict;'

  angular
    .module('gaddum.streaming')
    .factory('gaddumMusicProviderSpotifyService', gaddumMusicProviderSpotifyService);

  gaddumMusicProviderSpotifyService.$inject = [

    'providerSettingsService',
    '$q',
    '$timeout',
    'SearchModifier',
    '$http',
    'ErrorIdentifier',
    'EventIdentifier',
    'AccessCredentials',
    'SearchModifier',
    'gaddumMusicProviderService',
    'TrackInfo',
    'GenericImportTrack',
    'dataApiService',
    'ImportPlaylist',
    'PlaylistIdentifier',
    'authenticateSrvc',
    'credentialsSrvc'
    
  ];

  function gaddumMusicProviderSpotifyService(

    providerSettingsService,
    $q,
    $timeout,
    SearchModifier,
    $http,
    ErrorIdentifier,
    EventIdentifier,
    AccessCredentials,
    SearchModifier,
    gaddumMusicProviderService,
    TrackInfo,
    GenericImportTrack,
    dataApiService,
    ImportPlaylist,
    PlaylistIdentifier,
    authenticateSrvc,
    credentialsSrvc

  ) {


    // ------ UTILITY

  
    var MUSIC_PROVIDER_IDENTIFIER = null;
    var CACHED_ACCESS_CREDENTIALS = null;
    var CURRENT_TRACK_INFO = null;


    var TRACK_PLAYING = false;
    var MOOD_TO_ATTRIBUTE_LOOKUP = null;




    function isTrackPlaying(){
      return TRACK_PLAYING;
    }

    function setTrackPlaying(playing){
      TRACK_PLAYING = playing;
    }


    function createSpotifySearchModifiers() {

      var result = [];


      result.push(
        SearchModifier.build(name, "Track Name")
      );
      result.push(
        SearchModifier.build(artist, "Artist")
      );
      result.push(
        SearchModifier.build(album, "Album")
      );
      result.push(
        SearchModifier.build(tag, "Tags")
      );

      return result;

    }



    // PRIVATE

    function asyncAuthSuccess(response) {

//      console.log("asyncAuthSuccess");





      var deferred = $q.defer();
      var promises = [];

      var accessToken = response.access_token;
      var refreshToken = response.refresh_token;
      var expiresIn_ms = response.expires_in * 1000;
      var currentTimeJavaEpoch_ms = Date.now();
      

      var expiresAt_ms = currentTimeJavaEpoch_ms + expiresIn_ms;


      promises.push(providerSettingsService.asyncSet(MUSIC_PROVIDER_IDENTIFIER, 'access_token', accessToken));
      promises.push(providerSettingsService.asyncSet(MUSIC_PROVIDER_IDENTIFIER, 'expires_at', expiresAt_ms));

      // A login from a refresh token will not supply another. Don't write one, unless you get one
      if(!!refreshToken){
        promises.push(providerSettingsService.asyncSet(MUSIC_PROVIDER_IDENTIFIER, 'refresh_token', refreshToken));
      }

      $q.all(promises).then(
        function () {
          // now rebuild the cached credentials from the combined DB values. 
          CACHED_ACCESS_CREDENTIALS = null;
          asyncGetAccessCredentials().then(
            function(result){
              deferred.resolve(result);
            },
            function(error){
              deferred.reject(error);
            });
        },
        function (error) {
          deferred.reject(error)
        }
      )

      return deferred.promise;
    }



    function asyncLogin() {
//      console.log("asyncAuthLogin");

      return authenticateSrvc.authenticate()
        .then(
          function (result) {
            asyncAuthSuccess(result);
          },
          function (error) {
            console.log("asyncAuthLogin: error: " + error.message);

            console.log(error);
          }
        )
        ;
    }


    function asyncRefresh(accessCredentials) {
//      console.log("asyncRefresh");

      var refreshToken = accessCredentials.getRefreshToken();

      return authenticateSrvc.refresh(refreshToken)
        .then(
          function (result) {
            asyncAuthSuccess(result);
          }
        );
    }




    function asyncGetVerifiedAccessCredentials() {
      var deferred = $q.defer();

      asyncGetAccessCredentials().then(
        function (accessCredentials) {
          if (accessCredentials) {
            if (accessCredentials.hasExpired()) {
              asyncRefresh(accessCredentials).then(
                function (refreshedCredentials) {
                  deferred.resolve(refreshedCredentials);
                },
                function (err) {
                  deferred.reject(err);
                }
              );
            } else {
              deferred.resolve(accessCredentials);
            }
          } else {
            deferred.resolve(null);
          }
        },
        function (err) {
          deferred.resolve(err);
        }
      );

      return deferred.promise;
    }

    function asyncGetAccessCredentials() {
      var deferred = $q.defer();

      $timeout(
        function () {
          if (CACHED_ACCESS_CREDENTIALS) {
            deferred.resolve(CACHED_ACCESS_CREDENTIALS);
          } else {
            asyncLookupAccessCredentials().then(
              function success(creds) {
                CACHED_ACCESS_CREDENTIALS = creds;
                deferred.resolve(creds);
              },
              function error(err) {
                CACHED_ACCESS_CREDENTIALS = null;
                deferred.reject(err);
              }
            )
          }
        }
      )

      return deferred.promise;
    }

    function asyncLookupAccessCredentials() {
      var deferred = $q.defer();
      var promises = [];
      promises.push(providerSettingsService.asyncGet(MUSIC_PROVIDER_IDENTIFIER, 'access_token'));
      promises.push(providerSettingsService.asyncGet(MUSIC_PROVIDER_IDENTIFIER, 'expires_at'));
      promises.push(providerSettingsService.asyncGet(MUSIC_PROVIDER_IDENTIFIER, 'refresh_token'));

      $q.all(promises).then(
        function (results) {

          if (results) {

            creds = AccessCredentials.build(
              results[0],
              results[1],
              results[2]
            ) // may be null - logged out

            deferred.resolve(creds);
          } else {
            deferred.reject(
              ErrorIdentifier.build(ErrorIdentifier.DATABASE, "Couldn't find authentication in database.")
            )
          }


          deferred.resolve();
        }
      )

      return deferred.promise;
    }





    function asyncGetMoodAttributesLookup() {

      var deferred = $q.defer();

      dataApiService.asyncGetSupportedMoodIds().then(

        function (moodIds) {
          var promises = [];
          var lookup = {};

          moodIds.forEach(function (moodId) {

            promises.push(dataApiService.asyncGetProviderMoodAttributes(MUSIC_PROVIDER_IDENTIFIER.id, moodId.id));
          });

          $q.all(promises).then(
            function (results) {
              for (var index = 0; index < moodIds.length; index++) {
                var mood_id = moodIds[index].id;
                var attributes = results[index];
                lookup[mood_id] = attributes;
              }
              deferred.resolve(lookup);
            },
            deferred.reject
          );
        },
        deferred.reject
      );
      return deferred.promise;
    }




    // ------ PUBLIC



    function asyncInitialise(musicProviderIdentifier, eventHandlerPromise) {

      if (!musicProviderIdentifier) {
        throw ("gaddumMusicProviderSpotifyService:asyncInitialise: no musicProviderIdentifier.");
      }

      if (!eventHandlerPromise) {
        throw ("gaddumMusicProviderSpotifyService:asyncInitialise: no eventHandlerPromise.");
      }

      TRACK_PLAYING = false;
      MUSIC_PROVIDER_IDENTIFIER = musicProviderIdentifier;
      EVENT_HANDLER_PROMISE = eventHandlerPromise;



      var deferred = $q.defer();
      var promises = [];

      promises.push(asyncGetMoodAttributesLookup().then(
        function (result) {
          MOOD_TO_ATTRIBUTE_LOOKUP = result;
        })
      );


      $q.all(promises).then(
        function (results) {
          deferred.resolve();
        },
        function (error) {
          deferred.reject(error);
        }

      );

      return deferred.promise;


    };


    function asyncIsLoggedIn() {
      var deferred = $q.defer();
      asyncGetVerifiedAccessCredentials().then(
        function (credentials) {
          if (credentials) {
            deferred.resolve(true);
          } else {
            deferred.resolve(false);
          }
        },
        function (err) {
          deferred.reject(err);
        }
      )
      return deferred.promise;
    }


    function asyncLogout() {

      // .. and our own in the DB
      var deferred = $q.defer();
      var promises = [];

      promises.push(providerSettingsService.asyncSet(MUSIC_PROVIDER_IDENTIFIER, 'access_token', null));
      promises.push(providerSettingsService.asyncSet(MUSIC_PROVIDER_IDENTIFIER, 'expires_at', null));
      promises.push(providerSettingsService.asyncSet(MUSIC_PROVIDER_IDENTIFIER, 'encrypted_refresh_token', null));

      CACHED_ACCESS_CREDENTIALS = null;


      $q.all(promises).then(
        function (arrayResult) {
          deferred.resolve();
        },
        function (err) {
          deferred.reject(err);
        }

      );

      return deferred.promise;
    }

    function base64ToTagArray(base64Enc) { // throws
      var result = [];
      if ((base64Enc != null) && (base64Enc.length > 0)) {
        var csv = atob(base64Enc);
        var array = csv.split(',');
        array.forEach(
          function (item) {
            result.push(item.trim());
          });
      }
      return result;

    }

    function tagArrayToBase64(tagArray) { //throws
      var result = "";
      var trimmed = [];
      if (tagArray != null) {
        tagArray.forEach(
          function (item) {
            trimmed.push(item.trim());
          }
        );
      }

      result = btoa(trimmed.join(','));

      return result;

    }


    function asyncGetSupportedGenres() {
      var deferred = $q.defer();


      providerSettingsService.asyncGet(MUSIC_PROVIDER_IDENTIFIER, 'base64_csv_genre_tags').then(
        function (base64Enc) {
          try {
            deferred.resolve(base64ToTagArray(base64Enc));
          } catch (e) {
            deferred.resolve([]);
          }

        });


      return deferred.promise;
    }


    function asyncSetGenres(candidates) {
      var deferred = $q.defer();

      $timeout(
        function () {
          try {
            var value = tagArrayToBase64(candidates);
            providerSettingsService.asyncSet(MUSIC_PROVIDER_IDENTIFIER, 'base64_csv_selected_genre_tags', value).then(
              function () {
                deferred.resolve();
              },
              function (error) {
                deferred.reject(
                  ErrorIdentifier.build(ErrorIdentifier.DATABASE, "asyncSetGenres: error: " + error.message)
                )
              }
            );
          } catch (e) {
            providerSettingsService.asyncSet(MUSIC_PROVIDER_IDENTIFIER, 'base64_csv_selected_genre_tags', null).then(
              function () {
                deferred.resolve();
              },
              function (error) {
                deferred.reject(
                  ErrorIdentifier.build(ErrorIdentifier.DATABASE, "asyncSetGenres: error: " + error.message)
                );
              }
            );
          }
        }
      );


      return deferred.promise;
    }

    function asyncGetGenres() {
      var deferred = $q.defer();


      providerSettingsService.asyncGet(MUSIC_PROVIDER_IDENTIFIER, 'base64_csv_selected_genre_tags').then(
        function (base64Enc) {
          try {
            deferred.resolve(base64ToTagArray(base64Enc));
          } catch (e) {
            deferred.resolve([]);
          }

        });


      return deferred.promise;
    }


    function asyncGetSupportedSearchModifiers() {
      // may make this a DB function
      var deferred = $q.defer();

      $timeout(
        function () {
          deferred.resolve(
            createSpotifySearchModifiers()
          );
        }
      );

      return deferred.promise;

    }


    // --- needs a tidy
    function asyncPlay(TID) {
      return $q(function (resolve, reject) {
        var deviceID = device.uuid;
        asyncGetAccessCredentials().then(function (result) {
          cordova.plugins.spotify.play(`spotify:track:${TID}`, {
            clientId: `${deviceID}`,
            token: `${result}`
          }).then(function () {
            return resolve(true);
          });
        });
      });
    }
    function asyncPause() {
      return $q(function (resolve, reject) {
        cordova.plugins.spotify.pause()
        then(function () {
          return resolve(true);
        });
      });
    }
    function asyncGetProfilePlaylist(offset, limit) {
      return $q(function (resolve, reject) {

        var resultArray = [];
        asyncGetAccessCredentials().then(function (result) {
//          console.log(result);
          var config = { headers: { 'Authorization': `Bearer ${result.accessToken}` } };
//          console.log(`https://api.spotify.com/v1/me/playlists?limit=${limit}&offset=${offset}`, config);
          $http.get(`https://api.spotify.com/v1/me/playlists?limit=${limit}&offset=${offset}`, config).then(function (results) {
            results.data.items.forEach(function (element) {
              resultArray.push(ImportPlaylist.build(null, element.name, element.id, element.images[0].url, element.owner.display_name));
            });
            return resolve(resultArray);
          });
        });
      });
    }






    function asyncImportPlaylistTracks(importPlaylist) {
      var deferred = $q.defer();

      // importPlaylist is now populated with an id

      asyncGetPlaylistTracks(importPlaylist.provider_playlist_ref)
        .then(
          function (trackInfoArray) {
            asyncImportTracks(trackInfoArray).then(
              function (genericImportTrackArray) {
                deferred.resolve(genericImportTrackArray);
              }
              ,
              deferred.reject
            );
          },
          deferred.reject
        );


      return deferred.promise;
    }


    function asyncAssociatePlaylistAndTracks(playlist, genericTrackArray) {
      var deferred = $q.defer();

      dataApiService.asyncAssociatePlaylistAndTracks(
        playlist,
        genericTrackArray).then(
          function (responses) {
//            console.log("imported associations: ------");
            responses.forEach(function (item) {
//              console.log("playlist: " + item.playlist_id + "  track: " + item.track_id);
            });
//            console.log("end imported associations: ------");
            deferred.resolve(responses);
          }
          ,
          deferred.reject

        );

      return deferred.promise;
    }


    function asyncGetPlaylist(playlistIdentifier) {
      var deferred = $q.defer();

      dataApiService.asyncGetGenericTracksInPlaylist(playlistIdentifier)
        .then(
          function (genericTracks) {
            var result = genericTracks;
            deferred.resolve(result);
          }
          ,
          deferred.reject

        );

      return deferred.promise;
    }








    function asyncImportPlaylistIdentifier(importPlaylist) {
      var deferred = $q.defer();

      dataApiService.asyncCreatePlaylist(importPlaylist.getName()).then(
        function playlistIdentifier(playlistIdentifier) {
          importPlaylist.id = playlistIdentifier.getId();

//          console.log("imported playlist: id: " + importPlaylist.getId() + " name: " + importPlaylist.getName());
//          console.log("-----------------");

          deferred.resolve(importPlaylist);
        },
        deferred.reject
      );


      return deferred.promise;
    }


    function asyncImportPlaylist(importPlaylist) {
      var deferred = $q.defer();

      // creates an identifier in the DB for the new playlist
      asyncImportPlaylistIdentifier(importPlaylist).then(

        // importPlaylist is now populated with an id
        function (importPlaylist) {



          // import all the tracks identified in the playlist
          asyncImportPlaylistTracks(importPlaylist).then(
            // returns an array of GenericImportTrack objects
            function (genericImportTrackArray) {

              // link together playlist and tracks in the DB
              asyncAssociatePlaylistAndTracks(
                PlaylistIdentifier.build(importPlaylist.getId(), importPlaylist.getName(), null, null),
                genericImportTrackArray).then(
                  function () {

                    // now return a Playlist object for confirmation
                    asyncGetPlaylist(
                      PlaylistIdentifier.build(importPlaylist.getId(), importPlaylist.getName(), null, null)
                    ).then(
                      deferred.resolve
                      ,
                      deferred.reject
                    );
                  }
                  ,
                  deferred.reject
                );
            },
            deferred.reject
          );
        },
        deferred.resolve

      );

      return deferred.promise;

    }

    function asyncImportPlaylists(importPlaylists) {
      var deferred = $q.defer();
      $timeout(
        function () {
          if (importPlaylists) {
            var promises = [];
            importPlaylists.forEach(function (playlist) {
              promises.push(asyncImportPlaylist(playlist));
            });

            $q.all(promises).then(
              deferred.resolve,
              deferred.reject
            );
          } else {
            deferred.resolve(null);
          }
        });
      return deferred.promise;
    }





    function asyncImportTracks(trackInfoArray) {

      var deferred = $q.defer();

      $timeout(
        function () {

          if (trackInfoArray) {

            var promises = [];

            trackInfoArray.forEach(
              function (trackInfo) {
                promises.push(dataApiService.asyncImportTrackInfo(trackInfo));
              }
            );

            $q.all(promises).then(
              function (responses) {
                var results = [];
                responses.forEach(function (response) {
                  if (!!response) {
                    results.push(response);
                  }
                });
                // console.log("imported tracks: ------");
                // results.forEach(function (item) {
                //   console.log("id: " + item.getId() + "  name: " + item.getName());
                // });
                // console.log("end imported tracks: ------");


                deferred.resolve(results);
              }

            );

          } else {
            deferred.resolve([]);
          }
        }
      );


      return deferred.promise;

    }
    function asyncGetPlaylistTracks(PID) {
      return $q(function (resolve, reject) {
        var resultArray = [];
        asyncGetAccessCredentials().then(function (result) {
          var config = { headers: { 'Authorization': `Bearer ${result.accessToken}` } };
          $http.get(`https://api.spotify.com/v1/playlists/${PID}/tracks`, config).then(function (result) {
            result.data.items.forEach(function (element) {
              resultArray.push(spotifyTrackToTrackInfo(element.track));
            });
            return resolve(resultArray);
          });
        });
      });
    }

    function asyncGetSupportedSearchModifier() {
      return $q(function (resolve, reject) {
        asyncMakeSearchModifiers().then(function (result) {
//          console.log("spot", result);
          return resolve(result);
        });
      });
    }
    function asyncMakeSearchModifiers() {
      return $q(function (resolve, reject) {
        var searchModifierArray = [];
        searchModifierArray.push(SearchModifier.build("track", "Track"));
        searchModifierArray.push(SearchModifier.build("artist", "Artist"));
        searchModifierArray.push(SearchModifier.build("album", "Album"));
        searchModifierArray.push(SearchModifier.build("genre", "Genre"));
        return resolve(searchModifierArray);
      });
    }

    var seekTrackCache = [];
    var offset = 0;
    var searchT = null;
    var trackCrit = null;
    function asyncSeekTracks(searchTerm, trackSearchCrit, limit, page) {
      return $q(function (resolve, reject) {
        if (searchT != searchTerm) {
          searchT = searchTerm;
          offset = 0;
          seekTrackCache = [];
        }
        if (trackCrit != trackSearchCrit) {
          trackCrit = trackSearchCrit;
          offset = 0;
          seekTrackCache = [];
        }
        var seekResult = [];
        if (seekTrackCache.length > (page * limit)) {
          var i;
          for (i = 0; (i < (seekTrackCache.length - (page * limit))) && (i < 10); i++) {
            seekResult.push(seekTrackCache[((page * limit) + i)]);
          }
          return resolve(seekResult);
        }
        else {
          asyncGetSeekTracks(searchTerm, trackSearchCrit, limit, offset).then(function (result) {
            result.forEach(function (resultTrack) {
              seekTrackCache.push(resultTrack);

            });
            if (result.length == 0) {
              return reject();
            }
            offset = offset + limit;
            asyncSeekTracks(searchTerm, trackSearchCrit, limit, page).then(function (promise) {
              return resolve(promise);
            });
          });
        }
      });
    }

    function asyncGetSeekTracks(searchTerm, trackSearchCrit, limit, offset) {
      return $q(function (resolve, reject) {
        asyncGetAccessCredentials().then(function (resultToken) {
          gaddumMusicProviderService.asyncGetSupportedGenres().then(function (resultGen) {
            var genres = null;
            genreCheck = false;
            searchResult = [];
            var searchString = null;
            genres = resultGen;
            trackSearchCrit.forEach(function (genCheck) {
              if (genCheck.id === "genre") {
                genreCheck = true;
              }
            })
            var baseSearchString = `https://api.spotify.com/v1/search?q=`;
            var config = { headers: { 'Authorization': `Bearer ${resultToken.accessToken}` } };
            trackSearchCrit.forEach(function (element) {
              if (element.id === "track") {
                if (genreCheck) {
                  genres.forEach(function (genre) {
                    searchString = baseSearchString + 'track:"' + searchTerm + '" genre:"' + genre + `"&type=track&limit=${limit}&offset=${offset}`;
                    $http.get(encodeURI(searchString), config).then(function (result) {
                      searchResult.push(result);
                    });
                  });
                }
                searchString = baseSearchString + 'track:"' + searchTerm + `"&type=track&limit=${limit}&offset=${offset}`;
                $http.get(encodeURI(searchString), config).then(function (result) {
                  searchResult.push(result);
                });

              }
              if (element.id === "artist") {
                if (genreCheck) {
                  genres.forEach(function (genre) {
                    searchString = baseSearchString + 'artist:"' + searchTerm + '" genre:"' + genre + `"&type=track&limit=${limit}&offset=${offset}`;
                    $http.get(encodeURI(searchString), config).then(function (result) {
                      searchResult.push(result);
                    });
                  });
                }
                searchString = baseSearchString + 'artist:"' + searchTerm + `"&type=track&limit=${limit}&offset=${offset}`;
                $http.get(encodeURI(searchString), config).then(function (result) {
                  searchResult.push(result);
                });

              }
              if (element.id === "album") {
                if (genreCheck) {
                  genres.forEach(function (genre) {
                    searchString = baseSearchString + 'album:"' + searchTerm + '" genre:"' + genre + `"&type=track&limit=${limit}&offset=${offset}`;
                    $http.get(encodeURI(searchString), config).then(function (result) {
                      searchResult.push(result);
                    });
                  });
                }
                searchString = baseSearchString + 'album:"' + searchTerm + `"&type=track&limit=${limit}&offset=${offset}`;
                $http.get(encodeURI(searchString), config).then(function (result) {
                  searchResult.push(result);
                });

              }
            });
            var trackList = [];
            var isntIn = false;
            $timeout(function () {
              var temp = searchResult;
              searchResult.forEach(function (element) {
                element.data.tracks.items.forEach(function (track) {
                  isntIn = false;
                  trackList.forEach(function (trackL) {
                    if (trackL.id === track.id) {
                      isntIn = true;
                    }
                    else {
                      seekTrackCache.forEach(function (cache) {
                        if (track.id === cache.id) {
                          isntIn = true;
                        }
                      });
                    }
                  });
                  if (!isntIn) {
                    trackList.push(spotifyTrackToTrackInfo(track));
                  }
                });
              });
//              console.log("final search ", trackList);
              return resolve(trackList);
            }, 1000);

          });
        });
      });
    }



    function spotifyTrackToTrackInfo(spotifyTrack) {
      var result = TrackInfo.build(
        spotifyTrack.name,
        spotifyTrack.album.name,
        spotifyTrack.artists[0].name,
        spotifyTrack.duration_ms,
        spotifyTrack.href,
        spotifyTrack.album.images[0].url,
        spotifyTrack.uri,
        MUSIC_PROVIDER_IDENTIFIER.getId()
      );
      return result;
    }


    function asyncCacheTrackInfo(trackInfo, genericTrack) {

      // create the reference to be cached
      var trackReference = dataApiService.utilities.toTrackReference(genericTrack, trackInfo);

      // associate the spotify reference with the original track.
      return dataApiService.asyncImportTrackReference(trackReference);


    }




    function createGenreSeed(genres) {
      var result = "";

      if (genres) {
        try {
          var elements = "";
          for (var index = 0; index < genres.length; index++) {
            elements += genres[index];
            if (index < genres.length - 1) {
              elements += ',';
            }
          }
          if (elements.length > 0) {
            result = "seed_genres=" + elements;
          }
        } catch (e) {
//          console.log("gaddumMusicProviderSpotifyService: createGenreSeed: warning: error occurred creating seed.");
        }
      }
      return result;

    }

    function createTunableAttributesSeed(moodId) {
      var result = "";

      if (moodId) {
        try {
          var attributes = MOOD_TO_ATTRIBUTE_LOOKUP[moodId.getId()];

          for (var index = 0; index < attributes.length; index++) {
            var attribute = attributes[index];
            var element = "target_" + attribute.attribute + "=" + attribute.value;
            result += element;
            if (index < attributes.length - 1) {
              result += '&';
            }
          }

        } catch (e) {
//          console.log("gaddumMusicProviderSpotifyService: createTunableAttributesSeed: warning: error occurred creating seed.");
        }
      }

      return result;
    }


    function createSearchComponent(genres, moodId) {

      var genreComponent = createGenreSeed(genres);
      var attributeComponent = createTunableAttributesSeed(moodId);

      var result = "";

      if (genreComponent.length > 0) {
        result = genreComponent;
      }
      if (result.length > 0) {
        if (attributeComponent.length > 0) {
          result += '&';
        }
      }
      result += attributeComponent;

      return result;
    }


    function createSearchParameters(genres, moodId, limit) {
      var result = "";
      var searchComponent = createSearchComponent(genres, moodId);
      var limitComponent = "limit=" + limit;

      if (searchComponent.length > 0) {
        searchComponent += "&";
      }

      result = searchComponent + limitComponent;

      return result;

    }

    function asyncSuggestTracks(genres, moodId, limit) {
      var deferred = $q.defer();

      asyncGetAccessCredentials().then(
        function (resultToken) {
          var baseSearchString = 'https://api.spotify.com/v1/recommendations?';
          var config = { headers: { 'Authorization': `Bearer ${resultToken.accessToken}` } };

          searchString = baseSearchString + createSearchParameters(genres, moodId, limit);

          var uri = encodeURI(searchString);

          $http.get(uri, config)
            .then(
              function gotA200(result) {
                try {
                  var results = [];
                  var tracks = result.data.tracks;

                  tracks.forEach(
                    function (track) {
                      results.push(spotifyTrackToTrackInfo(track));
                    }
                  );
                  deferred.resolve(results);

                } catch (error) {
                  // the tracks being supplied aren't in the format we need. Changed API?
                  deferred.reject(ErrorIdentifier.build(ErrorIdentifier.NO_MUSIC_PROVIDER, "bad data retrieved."));
                }
              },
              function notA200(response) {
                // there's an error from the server. We may be logged out. Reflect this in the error.
                deferred.reject(ErrorIdentifier.build(ErrorIdentifier.NO_MUSIC_PROVIDER, "http: " + response.status));
              }

            );
        }
      );
      return deferred.promise;
    }




    function asyncSeekTrackOnline(genericTrack) {
      var deferred = $q.defer();

      asyncGetAccessCredentials().then(
        function (resultToken) {
          var baseSearchString = 'https://api.spotify.com/v1/search?q=';
          var config = { headers: { 'Authorization': `Bearer ${resultToken.accessToken}` } };


          searchString = baseSearchString +
            'artist:"' + genericTrack.getArtist() + '" ' +
            'album:"' + genericTrack.getAlbum() + '" ' +
            'track:"' + genericTrack.getName() +
            '"&type=track' +
            '&limit=1' +
            '&offset=0';

          var uri = encodeURI(searchString);

          $http.get(uri, config)
            .then(
              function gotA200(result) {

                var item = result.data.tracks.items[0];

                // this is the closest Spotify can get to the incoming generic track
                var trackInfo = spotifyTrackToTrackInfo(item);

                // give the system the *actual* details of the track.
                deferred.resolve(trackInfo);
              },
              function notA200(response) {
                // there's an error from the server. We may be logged out. Reflect this in the error.
                deferred.reject(ErrorIdentifier.build(ErrorIdentifier.NO_MUSIC_PROVIDER, "http: " + response))
              }

            );
        }
      );
      return deferred.promise;
    }





    function asyncGetTrackInfo(genericTrack) {

      var deferred = $q.defer();

      $timeout(
        function () {
          dataApiService.asyncGetTrackInfos(
            genericTrack,
            MUSIC_PROVIDER_IDENTIFIER
          ).then(
            function (items) {
              if (items && items.length > 0) {
                // track found in cache
                var trackInfo = TrackInfo.buildFromObject(items[0]);
                deferred.resolve(trackInfo);
              } else {
                deferred.resolve(); // nothing found
              }
            },
            function (error) {
              deferred.reject(ErrorIdentifier.build(ErrorIdentifier.DATABASE, error.message));
            }
          );
        }
      );


      return deferred.promise;

    }




    function asyncTeardownCurrentTrack() {

//      console.log("spotifyService:asyncTeardownCurrentTrack");

      var deferred = $q.defer();

      $timeout(
        function () {
          setTrackPlaying(false);
          if (CURRENT_TRACK_INFO) {
            CURRENT_TRACK_INFO = null;
            cordova.plugins.spotify.pause().then(
              function () {
                cordova.plugins.spotify.seekTo(0).then(
                  deferred.resolve,
                  deferred.resolve
                );
              },
              deferred.resolve
            );
          } else {
            deferred.resolve();
          }
        }
      );
      return deferred.promise;
    }



    // sets the current track.
    // emits events according to what happens
    // look up trackInfo in cache.
    // if not there, search on line for it.
    // Cache the results.
    // hold a track info object.
    // rejects on catastophic errors.
    // a missing track is not catastrophic
    function asyncSetTrack(genericTrack) {

//      console.log("spotifyService:asyncSetTrack");

      var deferred = $q.defer();


      $timeout(
        function () {
          if (genericTrack) { // we can feild 'null' for generic track.
            // search cache for track
            asyncGetTrackInfo(genericTrack).then(
              function (trackInfo) {
                if (trackInfo) {
                  // found a cached track
                  CURRENT_TRACK_INFO = trackInfo;
                  deferred.resolve(trackInfo);
                } else {
                  // search spotify for something we can use
                  asyncSeekTrackOnline(genericTrack).then(
                    function (trackInfo) {
                      if (trackInfo) {
                        // now cache the result. Associate with the generic track, though.
                        asyncCacheTrackInfo(trackInfo, genericTrack).then(
                          function () {
                            CURRENT_TRACK_INFO = trackInfo;
                            deferred.resolve(trackInfo)
                          },
                          deferred.reject //database error
                        );
                      } else {
                        // nothing found;
                        deferred.resolve();
                      }
                    },
                    deferred.reject //network error
                  );
                }
              },
              deferred.reject //database error
            );
          } else {
            deferred.resolve(null);
          }
        });

      return deferred.promise;
    }


    // function asyncPauseCurrentTrack() {

    //   return cordova.plugins.spotify.pause();

    // }

    function asyncPlayTrackResume(trackInfo) {

      return cordova.plugins.spotify.resume();

    }

    function asyncPlayTrackFromBegining(trackInfo) {
      var deferred = $q.defer();
      $timeout(

        function () {
          if (trackInfo) {
              asyncGetAccessCredentials().then(
                function onAuth(authToken) {
                  cordova.plugins.spotify.play(trackInfo.getPlayerUri(), {
                    clientId: credentialsSrvc.clientId,
                    token: authToken.getAccessToken()
                  })
                    .then(
                      function onPlaying() {
                        cordova.plugins.spotify.seekTo(2) //special spotify thing - we want to ensure we get past the odd progress_ms = 1 thing when the track is just loaded. See getCurrentTrackProgressPercent
                          .then(
                            function onSeekSuccess() {
                              deferred.resolve(trackInfo);
                            },
                            function onSeekFail(error) {
                              deferred.reject(ErrorIdentifier.build(ErrorIdentifier.SYSTEM, "attempting to seek, but SDK said no."));
                            }
                          )
                      },
                      function onPlayFail(error) {
                        deferred.reject(ErrorIdentifier.build(ErrorIdentifier.SYSTEM, "attempting to play, but SDK said no."));
                      }
                    );
                },
                function onNoAuth() {
                  deferred.reject(ErrorIdentifier.build(ErrorIdentifier.SYSTEM, "attempting to play, but no access credentials."));
                }
              );
            
          } else {
            deferred.reject(ErrorIdentifier.build(ErrorIdentifier.SYSTEM, "attempting to play, but CURRENT_TRACK_INFO is null."));
          }
        }

      );

      return deferred.promise;
    }





    function calculateTrackProgressPercent(trackTime_ms) {

      var result = 0;

      if (CURRENT_TRACK_INFO) {
        var total_ms = CURRENT_TRACK_INFO.duration_ms;
        if (total_ms && total_ms > 0) {
          result = (trackTime_ms / total_ms) * 100;
          if (result > 100) {
            result = 100;
          }
        }
      }

      return result;

    }


    function asyncGetCurrentTrackProgressPercent() {
      var deferred = $q.defer();
      $timeout(
        function () {
          if (CURRENT_TRACK_INFO) {
            cordova.plugins.spotify.getPosition().then(
              function (position_ms) {
                // spotify special case.
                // we tear down by seeking to 0, but Spotify always sets this to 1 ms.
                // we detect this and return 0

                var result = 0;


                if (position_ms == 1) {
                  result = 0;
                } else {
                  if (position_ms == 0) {
                    //track is unloaded. This means track reached the end. 
                    result = 100;
                  } else {
                    result = calculateTrackProgressPercent(position_ms);
                  }
                }

                deferred.resolve(result);

              },
              function () {
                deferred.reject(ErrorIdentifier.build(ErrorIdentifier.SYSTEM, "problems getting track progress. Plugin aborted unexpectedly."));
              });
          } else {
            deferred.resolve(0);
          }
        }
      );

      return deferred.promise;
    }


    function getCurrentTrack() {
      return CURRENT_TRACK_INFO;
    }

    // emits events according to what happens
    // if spotify player is not playing
    // use the current TrackInfo object to 
    // obtain correct track id. 
    // Update spotify player.
    // play the  spotify player. 
    // rejects on catastophic errors.
    // a missing track is not catastrophic
    function asyncPlayCurrentTrack() {
//      console.log("spotifyService:playCurrentTrack");
      var deferred = $q.defer();

      // Dummy for now.

      $timeout(

        function () {

          if (CURRENT_TRACK_INFO) {
            if (!isTrackPlaying()) {
              setTrackPlaying(true);
              asyncPlayTrackFromBegining(CURRENT_TRACK_INFO).then(
                deferred.resolve()
                ,
                function (err) {
                  deferred.reject(ErrorIdentifier.build(ErrorIdentifier.NO_MUSIC_PROVIDER, "attempting to play, but plugin returned an error. Could be you don't have a premium account?"));
                }
              );
            } else {
              asyncPlayTrackResume(CURRENT_TRACK_INFO).then(
                deferred.resolve()
                ,
                function (err) {
                  deferred.reject(ErrorIdentifier.build(ErrorIdentifier.NO_MUSIC_PROVIDER, "attempting to play, but plugin returned an error. Could be you don't have a premium account?"));
                }
              );
            }
          } else {
            deferred.reject(ErrorIdentifier.build(ErrorIdentifier.SYSTEM, "attempting to play, but CURRENT_TRACK_INFO is null."));
          }

        }

      );

      return deferred.promise;



    }

    function asyncPauseCurrentTrack() {
      // pause the spotify player.

      var deferred = $q.defer();

      $timeout(

        function () {

          deferred.resolve(cordova.plugins.spotify.pause());
        }

      );

      return deferred.promise;


    }


    var service = {
      asyncInitialise: asyncInitialise,
      asyncLogin: asyncLogin,
      asyncIsLoggedIn: asyncIsLoggedIn,
      asyncLogout: asyncLogout,
      asyncGetSupportedSearchModifiers: asyncGetSupportedSearchModifiers,
      asyncGetSupportedGenres: asyncGetSupportedGenres,
      asyncSetGenres: asyncSetGenres,
      asyncGetGenres: asyncGetGenres,

      asyncSetTrack: asyncSetTrack,
      getCurrentTrack: getCurrentTrack,
      asyncPlayCurrentTrack: asyncPlayCurrentTrack,
      asyncPauseCurrentTrack: asyncPauseCurrentTrack,
      asyncGetCurrentTrackProgressPercent, asyncGetCurrentTrackProgressPercent,
      asyncTeardownCurrentTrack: asyncTeardownCurrentTrack,


      asyncGetSupportedSearchModifier: asyncGetSupportedSearchModifier,
      asyncSeekTracks: asyncSeekTracks,
      asyncSuggestTracks: asyncSuggestTracks,

      asyncGetProfilePlaylist: asyncGetProfilePlaylist,
      asyncImportPlaylists: asyncImportPlaylists,
      asyncImportTracks: asyncImportTracks

    };

    return service;
  }
})();
