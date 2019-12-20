(function () {
  'user strict';

  angular
    .module('gaddum.messages')
    .controller('messagesListDirectiveController', messagesListDirectiveController);

  messagesListDirectiveController.$inject = [
    '$state',
    '$stateParams',
    '$ionicSlideBoxDelegate',
    'messagesService',
    'friendsService',
    '$q',
    'openMessageModal',
    '$timeout'
  ];

  function messagesListDirectiveController(
    $state,
    $stateParams,
    $ionicSlideBoxDelegate,
    messagesService,
    friendsService,
    $q,
    openMessageModal,
    $timeout
  ) {
    var vm = angular.extend(this, {
      modalOpen:false
    });

    function init() {
      getMessages()/* .then(function success(result){
        console.log(result);
      }, function (err){
        console.log(err);
      }) */
    }

    vm.preventSlideBox = function preventSlideBox() {
      $ionicSlideBoxDelegate.enableSlide(false);
    };
    vm.allowSlideBox = function allowSlideBox(e) {
      $ionicSlideBoxDelegate.enableSlide(true);
    };

    // attaching these methods to ng-mousedown/up on ion-items
    // makes swiping the item not cause the slidebox to move
    vm.preventSlideBox = function preventSlideBox() {
      $ionicSlideBoxDelegate.enableSlide(false);
    };
    vm.allowSlideBox = function allowSlideBox(e) {
      $ionicSlideBoxDelegate.enableSlide(true);
    };

    vm.messagesList = messagesService.messagesList;
    vm.messages = [];
    function getMessages() {
      var deferred = $q.defer();

      //vm.messagesList = messagesService.messagesList;
      /* vm.messages=[
        {"From":"11111111-5500-4cf5-8d42-228864f4807a","Content":"Sword 1","message_ID":"Aatrox","message_type":"connectionRequest","sender_name":"Darkin swordsman"},
        {"From":"22222222-5500-4cf5-8d42-228864f4807a","Content":"Fox 2","message_ID":"Ahri","message_type":"connectionResponse","sender_name":"Magic fox"},
        {"From":"33333333-5500-4cf5-8d42-228864f4807a","Content":"Ninja 3","message_ID":"Akali","message_type":"musicSharing","sender_name":"Balance Ninja"},
        {"From":"44444444-5500-4cf5-8d42-228864f4807a","Content":"Cow 4","message_ID":"Alistar","message_type":"connectionRequest","sender_name":"Free Cow"},
        {"From":"55555555-5500-4cf5-8d42-228864f4807a","Content":"Sad boi 5","message_ID":"Amumu","message_type":"connectionRequest","sender_name":"Sad Mummy"},
        ]; */
      messagesService.getMessages().then(
        function success(messages) {
          //console.log("got MEssages", messages);
          var reducedMessages = messages.map(function (message) {
            return message.message.body;
          });
          vm.messages = reducedMessages;

          vm.messages.forEach(function (message) {
            //console.log("message 2+name2", message);
            friendsService.searchFriendsByID(message.From).then(function Success(friend) {
              //console.log("friend for name getting", friend);
              /* vm.friendcopy=friend;
              console.log("friend copy",vm.friendcopy);
              
              vm.nametoadd="";
              vm.nametoadd=vm.friendc.avatar_name;*/
              //console.log("name to add", friend.profile.avatar_name);
              message.sender_name = friend.profile.avatar_name;
              //console.log("with added name,", message)
            },
              function fail(err) {
                console.log(err);
              });


            /* var tempMessages=[];
            messages.forEach(function(m){
              tempMessages.push(m.message.body)
            })

            console.log("tempMessages",tempMessages);
            messages=tempMessages; */


            //console.log("set messages", messages);
          },
            function fail(error) {
              console.log(error);
            })

        });
    }


    vm.messageIcon = { "ConnectionRequest": "css/connectionRequestIcon.png", "ConnectionResponse": "css/connectionResponseIcon.png", "MusicSharing": "css/MusicSharingIcon.png" }

    vm.friends = [

    ]

    vm.getMessageSender = function (currentMessageID, index) {
      var sender = null;
      vm.messages.forEach(function (message) {
        if (message.message_ID == currentMessageID) {
          sender = message.From;
        }
      });
      //console.log("sender/id"+sender,currentMessageID)
      // console.log("message index: ",index);
      
      var canvasid= currentMessageID+index;
      vm.createMessageProfileGraphic(sender, canvasid);
    }

    var scale = 8;
    vm.createMessageProfileGraphic = function (friendID, messageid) {
      setTimeout(() => {
        //console.log("messageid=",messageid);
        var canvas = document.getElementById(messageid);
        //console.log("canvas=",canvas);

        //canvas = canvas[canvas.length - 1];
        var ctx = canvas.getContext('2d');
        var nx = Math.floor(canvas.width / scale);
        var ny = Math.floor(canvas.height / scale);
        var bin;
        var drawColour;

        friendsService.searchFriendsByID(friendID).then(function (friend) {
          //console.log(friend);

          drawColour = friend.profile.avatar_graphic.colour;
          for (var j = 0; j < friend.profile.avatar_graphic.values.length; j++) {
            bin = friend.profile.avatar_graphic.values[j].toString(2);
            for (var x = bin.length; x < 8; x++) {
              bin = "0" + bin;
            }
            //console.log(bin);
            for (var k = 0; k < bin.length; k++) {
              if (bin[k] == "1") {
                rect(k, j, nx, ny, drawColour, ctx);
              } else {
                rect(k, j, nx, ny, '#ffffff', ctx);
              }
            }

          }

        },
          function () {
            console.log("couldn't find friend", friendID);
          }
        );







      }, 0);

    }
      ;

    function rect(x, y, w, h, fs, ctx) {
      ctx.fillStyle = fs;
      ctx.fillRect(x * w, y * h, (w), h);
    }

    var friendsDummy = [

      {
        "profile": {
          "profile_id": "11111111-5500-4cf5-8d42-228864f4807a",
          "avatar_name": "Pineapple Fruit-Butter",
          "avatar_graphic": [
            0,
            0,
            0,
            24,/* 60 */
            24,
            0,
            0,
            0
          ],
          device_id: "dJUr6sA28ZY:A1A91bH-chjJ8lcq61ofrjoHjak3q6nCFALPGytdEsLzh2DacCx7ihhZHxd6pPSXYMhtx4MlcQekn1rzjB7c809aNzivPFu5jhA-SR6FWbvzfBsO8ySo6um8DVA9dgOgokzz0QU5vbEf"
        }
      },
      {
        "profile": {
          "profile_id": "22222222-5500-4cf5-8d42-228864f4807a",
          "avatar_name": "Strawberry Jam",
          "avatar_graphic": [
            0,
            96,
            96,
            0,
            0,
            6,
            6,
            0,

            /* 0,
            102,
            102,
            24,
            24,
            66,
            126,
            0 */
          ],
          device_id: "dJUr6sA28ZY:A2A91bH-chjJ8lcq61ofrjoHjak3q6nCFALPGytdEsLzh2DacCx7ihhZHxd6pPSXYMhtx4MlcQekn1rzjB7c809aNzivPFu5jhA-SR6FWbvzfBsO8ySo6um8DVA9dgOgokzz0QU5vbEf"
        }
      },
      {
        "profile": {
          "profile_id": "33333333-5500-4cf5-8d42-228864f4807a",
          "avatar_name": "Raspberry Puree",
          "avatar_graphic": [
            0,
            96,
            96,
            24,
            24,
            6,
            6,
            0
          ],
          device_id: "dJUr6sA28ZY:A3A91bH-chjJ8lcq61ofrjoHjak3q6nCFALPGytdEsLzh2DacCx7ihhZHxd6pPSXYMhtx4MlcQekn1rzjB7c809aNzivPFu5jhA-SR6FWbvzfBsO8ySo6um8DVA9dgOgokzz0QU5vbEf"
        }
      },
      {
        "profile": {
          "profile_id": "44444444-5500-4cf5-8d42-228864f4807a",
          "avatar_name": "Apple Curd",
          "avatar_graphic": [
            0,
            102,
            102,
            0,
            0,
            102,
            102,
            0
          ],
          device_id: "dJUr6sA28ZY:A4A91bH-chjJ8lcq61ofrjoHjak3q6nCFALPGytdEsLzh2DacCx7ihhZHxd6pPSXYMhtx4MlcQekn1rzjB7c809aNzivPFu5jhA-SR6FWbvzfBsO8ySo6um8DVA9dgOgokzz0QU5vbEf"
        }
      },
      {
        "profile": {
          "profile_id": "55555555-5500-4cf5-8d42-228864f4807a",
          "avatar_name": "Banana Fruit-Spread",
          "avatar_graphic": [
            0,
            102,
            102,
            24,
            24,
            102,
            102,
            0
          ],
          device_id: "dJUr6sA28ZY:A5A91bH-chjJ8lcq61ofrjoHjak3q6nCFALPGytdEsLzh2DacCx7ihhZHxd6pPSXYMhtx4MlcQekn1rzjB7c809aNzivPFu5jhA-SR6FWbvzfBsO8ySo6um8DVA9dgOgokzz0QU5vbEf"
        }
      },
    ];

    vm.messageClick = function (index) {
      console.log("clicked", vm.messages[index]);
      //message type thingy here?
      asyncLaunchModal(vm.messages[index]);
    };

    vm.openMessage= function(index){
      console.log(index);
    };

    function asyncLaunchModal(message) {
      var deferred = $q.defer();
      if (message.message_type == "musicSharing") {
        console.log("open music modal here");
      } else if(vm.modalOpen==false){
        $timeout(
          function () {
            friendsService.searchFriendsByID(message.From).then(function (friend) {

              var modalParams = [
                { "message": message },
                { "graphic": friend.profile.avatar_graphic }
                //{"graphic":
                /* ,
                { "userGenres": vm.selectedGenres },
                { "userProfile": vm.userProfile } */
              ];
              //console.log(modalParams[0].message);
              vm.modalOpen=true;
              openMessageModal.open(modalParams, callback, cancel);
              deferred.resolve();
            },
              function () {
                console.log("couldn't find friend", friendID);
              });
          }
        );


        return deferred.promise;
      } else{
        console.error("rejected attempt to to open second modal: "+message.message_type)
      }
    }

    function friendResponse(response){
      if (response=="accept") {
        console.log("accepted friend");
      } else {
        console.log("reject");
      }
    }

    function callback(params){
      console.log("callback params",params);
      vm.modalOpen=false;
      switch (params.type) {
        case "connectionRequest":
                console.log("run ConnectionResponse(params.body)",params.body);
          break;
      
        default:
                console.log("callback does not run function");
          break;
      }
    };

    function cancel(params){
      console.log("cancel params",params);
      vm.modalOpen=false;
    };

    

    init();


  }

})();
