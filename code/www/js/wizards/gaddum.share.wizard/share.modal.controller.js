

(function () {
  'use strict';

  angular
    .module('gaddum.share')
    .controller('shareWizardModalController', shareWizardModalController);

  shareWizardModalController.$inject = [
    'shareWizard',
    '$scope',
    '$timeout',
    '$q',
    'friendsService',
    'profileService',
    'PushMessage',
    'sendService'

  ];

  function shareWizardModalController(
    shareWizard,
    $scope,
    $timeout,
    $q,
    friendsService,
    profileService,
    PushMessage,
    sendService
  ) {
    var scale = 8;
    var sm = angular.extend(this, {
      itemSelected: false,
      emotionSelected: ''
    });
    $scope.shareWizard = shareWizard;
    function init() {

      sm.state = true;
      sm.displayArray = [];

      sm.itemSelected = false;
      sm.friendsName = "";
      sm.friendsPlural = 0;

      sm.params = shareWizard.getParams();
      friendsService.searchFriends("").then(function (result) {
        sm.friendsArray = result;
        sm.friendsArray.forEach(function (element) {
          sm.displayArray.push({ name: element.profile.avatar_name, value: false, profile: element.profile.profile_id });
        });
      });

    }
    init();
    function close() {
      shareWizard.close();
    }
    function changeState() {
      sm.state = !sm.state;
    }
    function send() {
      var count = 0;
      var friends = [];
      sm.displayArray.forEach(function (element) {
        if (element.value) {
          friends.push(sm.friendsArray[count]);
        }
        count++;

      });
      profileService.asyncGetUserProfile().then(
        function (user) {


          friends.forEach(function (friend) {
            var sharedProfiles = [user, friend.profile];
            var pushMessage = PushMessage.build(4, user.profile_id, uuid(), friend.profile.profile_id, sm.params.payload, sm.params.payloadFormatId);
            sendService.sendMessage(pushMessage,sharedProfiles);
          });
          close();
        });
    }
    function friendSelected(index) {
      sm.displayArray[index].value = !sm.displayArray[index].value;
      sm.itemSelected = sm.displayArray.reduce(function (prevVal, elem) {
        return prevVal || elem.value === true;
      }, false);
      sm.friendsName = sm.displayArray.reduce(function (prevVal, elem) {
        return (prevVal.length > 0 ? prevVal + ", " : prevVal) + (elem.value === true ? elem.name : "");
      }, "");
      sm.friendsPlural = sm.displayArray.reduce(function (prevVal, elem) {
        return prevVal + (elem.value === true ? 1 : 0);
      }, 0);
    }

    function isNextDisabled() {
      return (sm.itemSelected != true);
    }

    sm.createProfileGraphic = function (id) {
      var canvas = document.getElementsByClassName("shareCanvas");
      canvas = canvas[canvas.length - 1];
      var ctx = canvas.getContext('2d');
      var nx = Math.floor(canvas.width / scale);
      var ny = Math.floor(canvas.height / scale);
      var bin;
      var drawColour;
      for (var i = 0; i < sm.friendsArray.length; i++) {
        if (sm.friendsArray[i].profile.profile_id == id) {
          if (sm.friendsArray[i].profile.avatar_graphic.colour == null) {
            drawColour = "#000000"
          } else {
            drawColour = sm.friendsArray[i].profile.avatar_graphic.colour;
          };
          for (var j = 0; j < sm.friendsArray[i].profile.avatar_graphic.values.length; j++) {
            bin = sm.friendsArray[i].profile.avatar_graphic.values[j].toString(2);
            for (var x = bin.length; x < 8; x++) {
              bin = "0" + bin;
            }
            for (var k = 0; k < bin.length; k++) {
              if (bin[k] == "1") {
                rect(k, j, nx, ny, drawColour, ctx);
              } else {
                rect(k, j, nx, ny, '#ffffff', ctx);
              }
            }

          }
        }
      }
    };
    function rect(x, y, w, h, fs, ctx) {
      ctx.fillStyle = fs;
      ctx.fillRect(x * w, y * h, (w), h);
    }

    sm.friendSelected = friendSelected;
    sm.send = send;
    sm.close = close;
    sm.changeState = changeState;
    sm.isNextDisabled = isNextDisabled;
  }
})();
