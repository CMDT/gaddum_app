(function () {
  'use strict';
  angular
    .module('FriendsAddFriendModule')
    .controller('friendsAddFriendModalController', friendsAddFriendModalController);

    friendsAddFriendModalController.$inject = [
      '$scope',
      'FriendsAddFriendModal',
      'messagingService',
      'userSettingsService',
      'profileService',
      'SharedProfile',
      'ConnectionRequestPayload',
      'utilitiesService'
  ];

  function friendsAddFriendModalController(
    $scope,
    FriendsAddFriendModal,
    messagingService,
    userSettingsService,
    profileService,
    SharedProfile,
    ConnectionRequestPayload,
    utilitiesService
  ) {

    var vm = angular.extend(this, {
      params:null,
      playlist:[],
      modalpage:1
    });
    $scope.FriendsAddFriendModal = FriendsAddFriendModal;

    function init() {
      vm.params = FriendsAddFriendModal.getParams();
      if(vm.params.pageNum){
        vm.modalpage = vm.params.pageNum;
      }
      if(vm.params.content){
        console.log(vm.params.content);
      }
      vm.addFriendsModalUpdater();
    };

    //copy paste will need a good look over

    vm.modalpage = 1;
    vm.modalTitles = { 0 : "",
                       1 : "Add a friend - Step 1",
                       2 : "Add a friend - Step 2",
                       3 : "Add a friend - Step 3",
                       4 : "Add a friend - Step 4",
                       5 : "Add a friend - Step 5" };

    vm.addFriendsModalNext = function(){
      vm.modalpage++;
      vm.addFriendsModalUpdater();
    };

    vm.addFriendsModalUpdater=function(){
      //vm.modalTitle = vm.modalTitles[vm.modalPage];
      if (vm.modalpage===3) {

        cordova.plugins.barcodeScanner.scan(
          function ( scan ) {
            profileService.asyncGetUserProfile().then(function(profile){
              var myProfile = SharedProfile.create_from_vars(
                profile[ profileService.SETTINGS.AVATAR_NAME ],
                profile[ profileService.SETTINGS.AVATAR_GRAPHIC ],
                profile[ profileService.SETTINGS.PROFILE_ID ],
                //profile[ profileService.SETTINGS.DEVICE_ID ] // this and next line wrong but save my sanity
                messagingService.device_id_key
              );
              console.log("heyo scan ",scan.text)
              var scannedProfile = SharedProfile.create_from_scan(scan.text);

              var connectionRequestPayload = ConnectionRequestPayload.build(myProfile, scannedProfile);
              connectionRequestPayload.recipient_id = scannedProfile.fcmDeviceId;
              messagingService.sendMessage(
                {
                  //connection_id: scannedProfile.fcmDeviceId, //response.data.id,
                  sender_id: messagingService.push.registrationId, // profile[ profileService.SETTINGS.DEVICE_ID ],
                  message_id: utilitiesService.createUuid(),
                  message_type: messagingService.message_type.CONNECTION_REQUEST,
                  sender_role: 0,
                  to:  scannedProfile.fcmDeviceId ,
                  recipient_id:  scannedProfile.fcmDeviceId ,
                  payload: btoa( JSON.stringify(connectionRequestPayload) )
                }
              ).then(
                function(data) {
                  // sent okay
                  console.log("sent - response is ", data);
                  alert("sent");
                  messagingService.addInboundMessageCallback(connectionRequestPayload.uuid, function(message){
                    if(message.uuid===connectionRequestPayload.uuid) {
                      // this probably our response
                    }
                  });
                  // END OF FOLLOWING
                  vm.addFriendsModalNext();
                },
                function(error){
                  // error
                  console.log(error);
                  alert("error senging");
                }
              );
            });
          },
          function (error) {
            alert("Scanning failed: " + error);
          },
          {
            preferFrontCamera : false, // iOS and Android
            showTorchButton : false, // iOS and Android
            resultDisplayDuration: 0, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
            formats : "QR_CODE", // default: all but PDF_417 and RSS_EXPANDED
            disableSuccessBeep: false // iOS and Android
          }
        );
      }

    };
    //vm.showFinishbutton=false;

    vm.addFriendsModalPrev=function(){
      vm.modalpage--;
      if(vm.modalpage===3) {
        vm.modalpage = 2; // so if you have scanned, and pick prev, you go back to *before* the scanning
      }
      vm.addFriendsModalUpdater();
    };

    vm.addFriendsModalClose=function(){
      vm.modalpage=1;
      vm.showFinishbutton=false;
      $scope.modal.remove()
      .then(function() {
        $scope.modal = null;
      });
    };
    vm.openQR = function(){
     FriendsAddFriendModal.callbackfail();
    };

    init();
  }
})();
