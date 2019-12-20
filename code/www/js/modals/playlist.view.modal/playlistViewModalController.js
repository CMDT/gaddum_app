(function () {
  'use strict';
  angular
    .module('playlistViewModule')
    .controller('playlistViewModalController', playlistViewModalController);

  playlistViewModalController.$inject = [
    '$scope',
    'playlistViewModal',
    'playlistEditModal',
    'playlistService',
    'addToPlaylistWizard',
    'shareWizard',
    'GenericTrack',
    'howAreYouModal',
    'MoodedPlaylist',
    'userProfilerService',
    'StatementCriteria',
    '$ionicListDelegate',
    'Payload'
  ];

  function playlistViewModalController(
    $scope,
    playlistViewModal,
    playlistEditModal,
    playlistService,
    addToPlaylistWizard,
    shareWizard,
    GenericTrack,
    howAreYouModal,
    MoodedPlaylist,
    userProfilerService,
    StatementCriteria,
    $ionicListDelegate,
    Payload
  ) {

    var currentTrack = null;
    var saveParams = null;

    var vm = angular.extend(this, {
      params:null,
      playlist:[]
    });
    $scope.playlistViewModal = playlistViewModal;


    function init() {
      vm.params = playlistViewModal.getParams();
    };

    vm.returnData = function () {
      //console.log("?");
    };

    vm.editPlaylist= function(){
      var modalParams = null;
      var saveTracks = [];
      vm.params.tracks.forEach(function(track) {
        saveTracks.push(track);
      });
      saveParams={"playlist":vm.params.playlist.getName(),"tracks":saveTracks};
      modalParams=vm.params;
      playlistViewModal.closeCheckFalse();
      playlistEditModal.open(modalParams,refreshTrack,modalCancel);
    };

    function modalCancel(){
      // thanks!
    };

    function refreshTrack(tracks,name){
      if(tracks||name){
        if (tracks){
          vm.params.tracks = tracks;
        }
        if(name){
          vm.params.playlist.setName(name);
          vm.params.name = name;
        }
        playlistViewModal.data(vm.params.tracks, vm.params.playlist);
      }
      else{
        vm.params.playlist.setName(saveParams.playlist);
        vm.params.tracks = saveParams.tracks;
      }
    }

    function play(track){
      $ionicListDelegate.closeOptionButtons();
      currentTrack = track;
      howAreYouPlay();
    }

    function howAreYouPlay(){
      howAreYouModal.open(null,fnCallbackHowAreYouOkPlay,fnCallbackHowAreYouCancel);
      playlistViewModal.closeCheckFalse();
    }

    function fnCallbackHowAreYouOkPlay(emotion){
      var arrayTrack = [];
      var mooded= null;
      var moodedArray =[];
      arrayTrack.push(currentTrack);
      mooded = MoodedPlaylist.build(emotion,arrayTrack);
      moodedArray.push(mooded);
      playlistService.asyncPlay(moodedArray);
      // console.log(moodedArray);
    }

    function playPlaylist(){
      howAreYouPlayPlaylist();
    }

    function howAreYouPlayPlaylist(){
      howAreYouModal.open(null,fnCallbackhowAreYouPlayPlaylist,fnCallbackHowAreYouCancel);
      playlistViewModal.closeCheckFalse();
    }

    function fnCallbackhowAreYouPlayPlaylist(emotion){
      var mooded= null;
      var moodedArray =[];
      mooded = MoodedPlaylist.build(emotion,vm.params.tracks);
      moodedArray.push(mooded);
      playlistService.asyncPlay(moodedArray);
      // console.log(moodedArray);
    }

    function fnCallbackHowAreYouCancel(){
      // console.log("modal canceled");
    }

    function addToPlaylist(track){
      $ionicListDelegate.closeOptionButtons();
      // console.log("track", track);
      var trackToAdd = [];
      trackToAdd.push(track);
      addToPlaylistWizard.open(trackToAdd,fnCallbackAddToPlaylistOk,fnCallbackAddToPlaylistCancel);
      playlistViewModal.closeCheckFalse();
    }

    function addPlaylistToPlaylist(){
      addToPlaylistWizard.open(vm.params.tracks,fnCallbackAddToPlaylistOk,fnCallbackAddToPlaylistCancel);
      playlistViewModal.closeCheckFalse();
    }
    function fnCallbackAddToPlaylistOk(){
      //
    }

    function fnCallbackAddToPlaylistCancel(){
      playlistService.asyncGetPlaylistTracks(vm.params.playlist).then(function (tracks) {
        vm.params.tracks = tracks;
      });
    }

    function asyncMakeTrackStatement(track){
      $ionicListDelegate.closeOptionButtons();
      currentTrack = track;
      howAreYouTrack();
      playlistViewModal.closeCheckFalse();
    }

    function howAreYouTrack(){
      howAreYouModal.open(null,fnCallbackHowAreYouOkTrack,fnCallbackHowAreYouCancel);
    }

    function fnCallbackHowAreYouOkTrack(emotion){
      var StatCrit = StatementCriteria.build(emotion,currentTrack);
      playlistService.asyncMakeTrackStatement(StatCrit);
    }
    function sharePlaylist(){
      playlistViewModal.closeCheckFalse();
      var payloadData = Payload.build(vm.params);
      var shareParams = {payload: payloadData, payloadFormatId: 0};
      shareWizard.open(shareParams,refreshTrack,modalCancel);
    }
    vm.sharePlaylist = sharePlaylist;
    vm.playPlaylist = playPlaylist;
    vm.asyncMakeTrackStatement=asyncMakeTrackStatement;
    vm.addToPlaylist=addToPlaylist;
    vm.addPlaylistToPlaylist=addPlaylistToPlaylist;
    vm.play=play;

    init();
  }
})();
