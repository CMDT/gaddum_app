(function () {
    'use strict';

    console.log("HERE: Gaddum Player");

    angular
        .module('gaddum.player')
        .factory('playerService', playerService);

    playerService.$inject = [
        '$timeout',
        '$q',
        'gaddumMusicProviderService',
        'userProfilerService',
        'EventIdentifier'
    ];




    // User uses a slider box component to generate a playlist.
    // Slider-box service creates a MoodedPlaylist.
    // Slider-box service calls userProfilerService.asyncLoadMoodedPlaylists()

    // playerService is a listener on the userProfileService
    // userProfilerService.loads in the new playlist, broadcasts a PLAYLIST_NEW event
    // playerService catches PLAYLIST_NEW event:
    //      playerService calls userProfilerService.player.asyncBegin
    //      userProfilerService returns a genericTrack object.
    //      playerService calls gaddumMusicProviderService.setTrack() with the genericTrack
    //      gaddumMusicProviderService calls into the concrete musicServiceProvider.asyncSetTrack()
    //      Concrete musicProviderService searches cache for genericTrack. 
    //          If not found, it goes online to search
    //           if found, broadcasts a TRACK_NEW event to listeners, with a payload of TrackInfo object
    //           if not found, broadcasts a TRACK_NOT_FOUND to listeners
    // playerService broadcasts PLAYLIST_NEW event



    // playerService is a listener on the musicServiceProvider.
    // playerService catches TRACK_NOT_FOUND event:
    //      playerService calls userProfilerService.player.asyncNext
    //      if userProfilerService returns a genericTrack object.
    //          playerService calls gaddumMusicProviderService.setTrack() with the genericTrack, **as above**
    //      if userProfileService returns null
    //          playerService broadcasts a PLAYLIST_END event
    // otherwise, playerService re-broacasts all events to listener. 
    // 
    // gaddumPlayerController catches PLAYLIST_NEW:
    //      resets controller. disables prevButton, playButton, enables next button
    // gaddumPlayerController catches TRACK_NEW: 
    //      enables playButton
    // gaddumPlayerController catches TRACK_PROGRESS_PERCENT:
    //      enables pauseButton, prevButton (to repeat), nextButton
    //      displays new progress from payload.
    //      
    // gaddumPlayerController catches TRACK_PAUSED:
    //      enbles playButton
    // gaddumPlayerController catches LOGGED_OUT
    //      disables all controls
    // gaddumPlayerController catches LOGGED_IN
    //      re-enables all controls
    // gaddumPlayerController catches PLAYLIST_END
    //      enables prevButton, disables playButton, nextButton
    //      initialises track and artistReadout
    //      blanks album artwork







    function playerService(
        $timeout,
        $q,
        gaddumMusicProviderService,
        userProfilerService,
        EventIdentifier,

    ) {


        var CONSUMED = true;
        var PASSED = false;
        var EVENT_HANDLER_PROMISE = null;




        function asyncDoSkipNext() {
            var deferred = $q.defer();
            userProfilerService.player.asyncNext().then(
                function onTrack(genericTrack) {

                    gaddumMusicProviderService.asyncSetTrack(genericTrack).then(
                        function (trackInfo) {
                            if (trackInfo) {
                                gaddumMusicProviderService.asyncPlayCurrentTrack();
                            } else {
                                asyncBroadcastEvent(EventIdentifier.build(EventIdentifier.PLAYLIST_END));
                            }
                            deferred.resolve();
                        },
                        deferred.reject
                    );
                },
                deferred.reject
            );
            return deferred.promise;
        }

        function asyncDoSkipPrev() {
            var deferred = $q.defer();
            userProfilerService.player.asyncPrev().then(
                function onTrack(genericTrack) {

                    // genericTrack may be null
                    gaddumMusicProviderService.asyncSetTrack(genericTrack).then(

                        function (trackInfo) {
                            if (trackInfo) {
                                gaddumMusicProviderService.asyncPlayCurrentTrack();
                            } else {
                                asyncBroadcastEvent(EventIdentifier.build(EventIdentifier.PLAYLIST_NEW));
                            }
                            deferred.resolve();
                        },
                        deferred.reject
                    );
                }
                ,
                deferred.reject
            );


            return deferred.promise;
        }

        function asyncDoBegin() {
            var deferred = $q.defer();
            userProfilerService.player.asyncBegin().then(
                function onTrack(genericTrack) {
                    if (genericTrack) {
                        gaddumMusicProviderService.asyncSetTrack(genericTrack).then(
                            deferred.resolve,
                            deferred.reject
                        );
                    } else {
                        //someone delivered us an empty playlist
                        deferred.reject();
                    }
                },
                deferred.reject
            );
            return deferred.promise;
        }

        function asyncHandleTrackNotFound() {
            var deferred = $q.defer();

            asyncTrackIsBadGetAnother().then(
                function onTrack(genericTrack) {
                    if (genericTrack) {
                        gaddumMusicProviderService.setTrack(genericTrack).then(
                            function trackSet() {
                                deferred.resolve(CONSUMED);
                            },
                            deferred.reject
                        );
                    } else {
                        asyncBroadcastEvent(
                            EventIdentifier.build(
                                EventIdentifier.PLAYLIST_END));
                        deferred.resolve(CONSUMED);
                    }
                },
                function () {
                    deferred.resolve(CONSUMED);
                },
                deferred.reject
            );
            return deferred.promise;
        }

        // event from the userProfilerService indicates the user has loaded a new playlist
        // send the event to other listeners, and 
        // kick-off getting the first track and queueing it.
        function asyncHandlePlaylistNew() {
            var deferred = $q.defer();

            asyncDoBegin().then(
                function beganOK() {
                    deferred.resolve(PASSED); // pass the event to listeners
                },
                deferred.reject
            );
            return deferred.promise;
        }



        function asyncHandleDefault() {
            var deferred = $q.defer();

            $timeout(
                function () {
                    deferred.resolve(PASSED); // default behaviour is to allow the event to get passed to listeners
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


        function asyncHandleEvent(eventIdentifier) {
            switch (eventIdentifier.getId()) {
                case EventIdentifier.TRACK_NOT_FOUND:
                    return asyncHandleTrackNotFound();
                case EventIdentifier.PLAYLIST_NEW:
                    return asyncHandlePlaylistNew();
                default:
                    return asyncHandleDefault();
            }
        }



        function asyncOnEvent(eventIdentifier) {
            var deferred = $q.defer();

            $timeout(
                function () {
                    asyncHandleEvent(eventIdentifier).then(
                        function eventHandled(isConsumed) {
                            if (!isConsumed) {
                                asyncBroadcastEvent(eventIdentifier);
                                deferred.resolve();
                            } else {
                                deferred.resolve();
                            }
                        },
                        // event handler barfed. 
                        function eventErrored(error) {
                            // we'll just make sure the user can't do anything else until they have chosen another playlist.
                            asyncBroadcastEvent(
                                EventIdentifier.build(
                                    EventIdentifier.PLAYLIST_NONE));
                            deferred.resolve();  // can't make the event source handle it
                        }

                    );
                }
            );
            return deferred.promise;
        }

        function asyncControlSkipNext() {
            console.log("control Skip Next.");
            var deferred = $q.defer();

            asyncDoSkipNext().then(
                function trackQueued() {
                    deferred.resolve();
                },
                function noTrack(error) {
                    // this also gets called on the music provider barfing with an error, so this is also auto recovery.
                    if (!error) {
                        asyncBroadcastEvent(
                            EventIdentifier.build(
                                EventIdentifier.PLAYLIST_END, null));
                    } else {
                        asyncBroadcastEvent(
                            EventIdentifier.build(
                                EventIdentifier.PLAYLIST_NONE, null));
                    }
                }
            );

            return deferred.promise;
        }

        function asyncControlSkipPrev() {
            console.log("control Skip Next.");

            var deferred = $q.defer();

            asyncDoSkipPrev().then(
                function trackQueued() {
                    deferred.resolve();
                },
                function noTrack(error) {
                    if (!error) {
                        asyncBroadcastEvent(
                            EventIdentifier.build(
                                EventIdentifier.PLAYLIST_NEW, null));
                    } else {
                        asyncBroadcastEvent(
                            EventIdentifier.build(
                                EventIdentifier.PLAYLIST_NONE, null));
                    }
                }
            );

            return deferred.promise;
        }



        function asyncControlPlay() {
            var deferred = $q.defer();
            console.log("control Play.");
            var defered = $q.defer();
            gaddumMusicProviderService.asyncPlayCurrentTrack().then(
                deferred.resolve,
                function (error) {
                    // try and recover by forcing the user to attempt re-doing the playlist
                    asyncBroadcastEvent(
                        EventIdentifier.build(
                            EventIdentifier.PLAYLIST_NONE, null));
                    deferred.resolve;
                }
            );

            return deferred.promise;
        }

        function asyncControlPause() {
            console.log("control Pause.");

            var deferred = $q.defer();
            gaddumMusicProviderService.asyncPauseCurrentTrack().then(
                deferred.resolve,
                function (error) {
                    // try and recover by forcing the user to attempt re-doing the playlist
                    asyncBroadcastEvent(
                        EventIdentifier.build(
                            EventIdentifier.PLAYLIST_NONE, null));
                    deferred.resolve;
                }
            );

            return deferred.promise;
        }


        function initialise(eventHandlerPromise) {
            EVENT_HANDLER_PROMISE = eventHandlerPromise;
            // this will kick-off a process which will lead 
            // an event being broadcast containing login information
            gaddumMusicProviderService.asyncIsLoggedIn();
        }


        var service = {
            // requests the next track in the playlist
            // writes an Observation to the database
            // returns the TrackInfo object for the selected track,
            // or null if there are no more tracks
            asyncControlSkipNext: asyncControlSkipNext,

            // requests the previous track in the playlist
            // writes an Observation to the database
            // returns the TrackInfo object for the selected track,
            // or null if there are no more tracks
            asyncControlSkipPrev: asyncControlSkipPrev,


            // requests to start the paused track
            // writes an Observation to the database
            asyncControlPlay: asyncControlPlay,

            // requests to pause the playing track
            // writes an Observation to the database
            asyncControlPause: asyncControlPause,

            // event handler interface. This is passed to the
            // Music Provider service on initialisation
            // The music provider will pass EventIdentifier objects.
            promiseHandleEvent: asyncOnEvent,


            // provides a promise to handle events passed to the player service
            initialise


        };

        return service;
    }





})();
