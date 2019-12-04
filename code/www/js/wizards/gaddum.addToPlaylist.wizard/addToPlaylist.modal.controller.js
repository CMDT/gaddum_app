

(function () {
  'use strict';

  angular
    .module('gaddum.playlists')
    .controller('addToPlaylistModalController', addToPlaylistModalController);

  addToPlaylistModalController.$inject = [
    'addToPlaylistWizard',
    '$scope',
    '$timeout',
    '$q',
    'playlistService',
    'GenericTrack',
    'playlistCreateModal'

  ];

  function addToPlaylistModalController(
    addToPlaylistWizard,
    $scope,
    $timeout,
    $q,
    playlistService,
    GenericTrack,
    playlistCreateModal
  ) {
    var mc = angular.extend(this, {
      itemSelected: false,
      emotionSelected: ''
    });
    $scope.addToPlaylistWizard = addToPlaylistWizard;
    function init() {

      mc.state = true;
      mc.displayArray = [];

      mc.itemSelected = false;
      mc.playlistName = "";
      mc.playlistsPlural = 0;

      mc.params = addToPlaylistWizard.getParams();
      console.log(mc.params);
      playlistService.asyncSeekPlaylists("").then(function (result) {
        mc.playlistArray = result;
        mc.playlistArray.forEach(function (element) {
          mc.displayArray.push({ name: element.getName(), value: false });
        });
      });

    }
    init();
    function close() {
      addToPlaylistWizard.close();
    }
    function createPlaylist() {
      playlistCreateModal.open(null, createRefresh, null);
    }
    function createRefresh(name) {
      if (name) {
        playlistService.asyncCreatePlaylist(name).then(function (result) {
          playlistService.asyncSeekPlaylists("").then(function (result) {
            mc.playlistArray = result;
            mc.displayArray= [];
            mc.itemSelected = false;
            mc.playlistArray.forEach(function (element) {
              mc.displayArray.push({ name: element.getName(), value: false });
            });
          });
        });
      }

    }
    function changeState() {
      mc.state = !mc.state;
    }
    function add() {
      var count = 0;
      var playlists = [];
      mc.displayArray.forEach(function (element) {
        if (element.value) {
          playlists.push(mc.playlistArray[count]);
        }
        count++;

      });
      playlists.forEach(function (playlist) {
        playlistService.asyncGetPlaylistTracks(playlist).then(function (result) {
          //give trackInfo(mc.params) to spotify service
          var trackGen = mc.params[0];
          trackGen.forEach(function (track) {
            result.push(track);
          });
          console.log("playlist:", playlist, "tracks:", result);
          playlistService.asyncSetPlaylistTracks(playlist, result).then(function (result) {
            addToPlaylistWizard.close();
          });
        });

      });
    }
    function playlistSelected(index) {
      mc.displayArray[index].value = !mc.displayArray[index].value;
      mc.itemSelected = mc.displayArray.reduce(function(prevVal, elem) {
        return prevVal || elem.value===true;
      }, false);
      mc.playlistName = mc.displayArray.reduce(function(prevVal, elem) {
        return (prevVal.length>0?prevVal+", ":prevVal)+(elem.value===true?elem.name:"");
      }, "");
      mc.playlistsPlural = mc.displayArray.reduce(function(prevVal,elem) {
        return prevVal+(elem.value===true?1:0);
      }, 0);
    }

    function isNextDisabled() {
      return(mc.itemSelected != true);
    }

    mc.playlistSelected = playlistSelected;
    mc.add = add;
    mc.close = close;
    mc.createPlaylist = createPlaylist;
    mc.changeState = changeState;
    mc.isNextDisabled = isNextDisabled;
  }
})();
