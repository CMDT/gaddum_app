(function () {
  'use strict';

  angular
    .module('gaddum.models')
    .factory('EventIdentifier', EventIdentifier)
    ;

  EventIdentifier.$inject = [

  ];
  function EventIdentifier(

  ) {

    EventIdentifier.TRACK_NEW  = -1; // a new track has been queued
    EventIdentifier.TRACK_PAUSED = -2 // the playing of the selected track has been paused
    EventIdentifier.TRACK_PROGRESS_PERCENT = -3, // progress through selected track
    EventIdentifier.TRACK_END = -4; // The current track has hit 100% and has ended. Not emitted when skipping to another track,
    EventIdentifier.TRACK_NOT_FOUND - 5, //this should be an expected outcome if receiving shared tracks from another source.
    EventIdentifier.TRACK_ERROR = -6; // an error has occured playing the track / the track is not available
    EventIdentifier.LOGGED_OUT = -7; // the music provider has been logged out
    EventIdentifier.LOGGED_IN = -8; // the music provider has been logged in
    EventIdentifier.INTERNET_DOWN = -9; // internet connection lost
    EventIdentifier.INTERNET_UP = -10; // internet connection found
    EventIdentifier.PLAYLIST_NEW  = -11; // a new playlist is available
    EventIdentifier.PLAYLIST_END = -12; // no more tracks available in playlist.
    EventIdentifier.PLAYLIST_NONE = -13; // there is nothing to play.

    function EventIdentifier(id, payload) {
      // Public properties, assigned to the instance ('this')
      this.id = id;
      this.payload = payload;

    this.getId = function() {
      return this.id;
    }
    this.getPayload = function() {
      return this.payload;
    }
  };
    

    /** 
     * Static method, assigned to class
     * Instance ('this') is not available in static context
     */
    EventIdentifier.build = function (id, payload) {
      
        return new EventIdentifier(
          id, payload
        );

    };

    


    /**
     * Return the constructor function
     */
    return EventIdentifier;

  }
})();
