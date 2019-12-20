(function () {
  'use strict';

  angular
    .module('gaddum.friends')
    .controller('friendsDirectiveController', friendsController);

  friendsController.$inject = [
    '$state',
    '$stateParams',
    '$ionicSlideBoxDelegate',
    '$timeout',

    'friendsService',
    '$ionicModal',
    '$scope',
    'gaddumContextMenuItem',
    'gaddumShortcutBarService',
    'FriendsAddFriendModal'
  ];

  function friendsController(
    $state,
    $stateParams,
    $ionicSlideBoxDelegate,
    $timeout,


    friendsService,
    $ionicModal,

    $scope,
    gaddumContextMenuItem,
    gaddumShortcutBarService,
    FriendsAddFriendModal
  ) {
    var vm = angular.extend(this, {
      friends: null,
      test: document.createElement("p"),
      showcamera:false,
      searchText:"",
      searching:false,
      scanner: new Instascan.Scanner({
        video: document.getElementById('preview'),
        continious: true,
        scanPeriod: 5,
        backgroundScan: false,
        refactoryPeriod: 3000,
        mirror: false
        
    })
      //
    });
    var _interval_ms = 100;
    var moodChoices = [];
    var moodGuess = {};
    var flag = false;
    var tempFriends;
    var ctx;
    var scale = 8;
    var confirmDelete;
    var indexToDelete;


    function update() {

    }

    function init() {
      createModalList();
      vm.friends = friendsService.getAllFriends();
      update();
    }
    /* init(); */

    vm.preventSlideBox = function preventSlideBox() {
      $ionicSlideBoxDelegate.enableSlide(false);
    };
    vm.allowSlideBox = function allowSlideBox(e) {
      $ionicSlideBoxDelegate.enableSlide(true);
    };

    // var searchinput = document.getElementById("searchBox");
    //     searchinput.addEventListener("keyup",function(event){
    //       if (event.keyCode===13) {
    //         event.preventDefault();
    //         document.getElementById("searchButton").click();
    //       }
    //     });

    vm.createProfileGraphic = function (id) {

      var canvas = document.getElementsByClassName("profileCanvas");
      canvas = canvas[canvas.length - 1];
      var ctx = canvas.getContext('2d');
      var nx = Math.floor(canvas.width / scale);
      var ny = Math.floor(canvas.height / scale);
      var bin;
      var drawColour;
      for (var i = 0; i < vm.friends.length; i++) {
        if (vm.friends[i].profile.profile_id == id) {
          if (vm.friends[i].profile.avatar_graphic.colour==null) {
            drawColour="#000000"
          }else{
            drawColour=vm.friends[i].profile.avatar_graphic.colour;
          };
          for (var j = 0; j < vm.friends[i].profile.avatar_graphic.values.length; j++) {
            bin = vm.friends[i].profile.avatar_graphic.values[j].toString(2);
            for (var x = bin.length; x < 8; x++) {
              bin= "0"+bin;
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
      ctx.fillRect(x*w, y*h, (w), h);
    }

    vm.logg = function logg() {
      console.log("working");
    };

    vm.sharedProfile = [{
      "profile": {
        "profile_id": "99999999-5500-4cf5-8d42-228864f4807a",
        "avatar_name": "Lemon Jelly",
        "avatar_graphic": [
          0,
          102,
          102,
          24,
          24,
          66,
          126,
          0
        ],
        device_id: ""
      }
    }];

    vm.addFriend = function addFriend(param) {
      if(!param){
        param = {pageNum: 1, content: null};
      }
      FriendsAddFriendModal.open(param,funcOk,scanQRcode);
    };
    function funcOk(){

    }
    
    vm.search = function search(search) {
      // var searchInput = document.getElementsByName("searchTextInput");
      // var search = searchInput[0].value;
      $('#searchBox').blur();
      vm.searching = true;
      console.log(search);
      //clears vm.friends to prevent the canvas bug
      vm.friends=[];
      friendsService.searchFriends(search)
      .then(function(friends){
        vm.searching = false;
        vm.friends = friends;
      });
    };

    vm.loadModal = function loadModal() {
      $ionicModal.fromTemplateUrl('js/directives/friends/friendsDeleteModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.modal = modal;
        $scope.modal.show();
        flag = false;
      });
    };

    vm.addFriendsModal = function () {
      $ionicModal.fromTemplateUrl('js/directives/friends/friendsAddModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.modal = modal;
        $scope.modal.show();
        flag = false;
      });
    };
    vm.modalpage=1;
    vm.addFreindsModalNext= function(){
      //console.log("miss_____________________________________________ modal ="+vm.modalpage);
      vm.modalpage++;
      vm.addFriendsModalUpdater();
    };
    vm.addFriendsModalUpdater=function(){
      if (vm.modalpage==1) {
        document.getElementById("addFriendsModalPrevButton").disabled=true;
        document.getElementById("addFriendsModalCancelButton").disabled=false;
        document.getElementById("addFriendsModalHeaderText").innerHTML="Add a friend - Step 1";
        document.getElementById("addFriendsModalBodyText").innerHTML="You're about to request connection to your friend. You can only do this when you are together. Ask your friends to show you their Gaddum app, at the Profile page";
        vm.showFinishbutton=false;
      } else if (vm.modalpage==2){
        document.getElementById("addFriendsModalPrevButton").disabled=false;
        document.getElementById("addFriendsModalCancelButton").disabled=false;
        document.getElementById("addFriendsModalHeaderText").innerHTML="Add a friend - Step 2";
        document.getElementById("addFriendsModalBodyText").innerHTML="You should be able to see your friend's Gaddum profile screen. Press Next, to start scanning QR code on their profile. This will begin your connection process.";
        vm.showFinishbutton=false;
      } else if (vm.modalpage==3){
        document.getElementById("addFriendsModalBodyText").innerHTML="This is where the scanner goes";
      }else if (vm.modalpage==4){
        document.getElementById("addFriendsModalCancelButton").disabled=true;
        document.getElementById("addFriendsModalHeaderText").innerHTML="Add a friend - Step 4";
        document.getElementById("addFriendsModalBodyText").innerHTML="Got it. Your connection rewuest has beem sent. Ask your friend to allow it. They'll see it in their gaddum 'Messages' Tab. You can make as many requests as you like. Just go back to the scanner, by pressing 'Again'";
        vm.showFinishbutton=false;
        vm.showFinishbutton=false;
      }else if (vm.modalpage==5){
        document.getElementById("addFriendsModalCancelButton").disabled=true;
        document.getElementById("addFriendsModalHeaderText").innerHTML="Add a friend - Step 5";
        document.getElementById("addFriendsModalBodyText").innerHTML="all your connection requestis have been sent. You can see if they succeeded in your 'Messages' tab.";
        vm.showFinishbutton=true;
        console.log(vm.showFinishbutton);
      }
    };
    vm.showFinishbutton=false;

    vm.addFreindsModalPrev=function(){
      vm.modalpage--;
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

    vm.addNewFriend= function(scannedFriend){
      scannedFriend=JSON.parse(atob(scannedFriend));
      friendsService.addNewFriend(scannedFriend);
      vm.modalpage++;
      console.log(vm.modalpage);
      vm.friends=[];
      setTimeout(function(){ vm.friends = friendsService.getAllFriends(); $scope.$apply(); }, 0);
      vm.addFriendsModalUpdater();
    };

    vm.deleteCheck=function(index){
      indexToDelete=index;
      confirmDelete=null;
      vm.loadModal();
    };

    vm.delete = function (index) {
      friendsService.deleteFriends(index);
      vm.friends = friendsService.getAllFriends();
    };

    vm.confirmDelete=function(){
      confirmDelete=true;
      $scope.modal.hide();
      vm.delete(indexToDelete);
    };
    vm.cancellDelete=function(){
      confirmDelete = false
      $scope.modal.hide();
      var fl=document.getElementById('friendsList');
    };

    vm.goMain = function () {
      $state.go('main');
    };
    vm.resetFlag = function () {
      flag = false;
    };

    $scope.modal2 = $ionicModal.fromTemplate('<div class="modal"><header class="bar bar-header bar-positive"> <h1 class="title">I\'m A Modal</h1><div class="button button-clear" ng-click="modal2.hide();vm.resetFlag()"><span class="icon ion-close"></span></div></header><content has-header="true" padding="true"><p>This is a modal👀😀</p></content></div>', {
      scope: $scope,
      animation: 'slide-in-up'
    });

    vm.getDummyImage = function (profile) {
      var imgurl;
      $.getJSON("https://randomuser.me/api/?inc=picture&&z=" + profile, function (data) {
        //console.log(data);
        imgurl = data.results[0].picture.thumbnail;
        console.log(imgurl);
        return imgurl;
      });
      return imgurl;
    };

    vm.test = { "results": [{ "picture": { "large": "https://randomuser.me/api/portraits/men/13.jpg", "medium": "https://randomuser.me/api/portraits/med/men/13.jpg", "thumbnail": "https://randomuser.me/api/portraits/thumb/men/13.jpg" } }], "info": { "seed": "35271a2963272a00", "results": 1, "page": 1, "version": "1.2" } };

    vm.toggleReorder = function () {
      var reorderGroup = document.getElementById('reorder');
      reorderGroup.disabled = !reorderGroup.disabled;
      reorderGroup.addEventListener('ionItemReorder', function (detail) {
        detail.complete(true);
      });
    };

    function createModalList() {
      var firstVariable = "Add Friend";
      var firstFunc = vm.addFriend;
      var contextMenu = [];
      contextMenu[0] = gaddumContextMenuItem.build(firstVariable, firstFunc);
      vm.conMenu = contextMenu;
      gaddumShortcutBarService.setContextMenu(vm.conMenu);
      //console.log(vm.conMenu);
    }

    init();






    //

    vm.scanner.addListener('scan', function (content) {
      /* $scope.modal.show().then(vm.modalpage=4);//remove this
      vm.addFriendsModalUpdater();//remove this */
      vm.showcamera = false;
      vm.scanner.stop();//stop the scanner when a code is scanned
      console.log("scanned: ", content);//display the scanned code in the log
      var param = {pageNum: 5, content: content};
      console.log(param);
      vm.addFriend(param);




      //content = scanned friend

      //window.location.href=content;//redirect to the link from the code (should be the response page again but this time with parameters)
    });


    //added for scanner 3/3
    function scanQRcode() {
      //get a camera, pass it into the start of the scanner object in the data model (defined above)
      //this will start the camera, show the video feed on the page and start scanning for a QRcode

      Instascan.Camera.getCameras().then(function (cameras) {
        //enumerate available cameras. result displayed in an array
        vm.showcamera = true;
        // $scope.modal.hide();
        console.log("cameras: ", cameras);
        if (cameras.length > 0)//if any cameras are found
        {
          if (cameras.length == 1)//check if there is only one camera
          {
            vm.scanner.start(cameras[0]);
            /* document.getElementById("modalvid").innerHTML=document.getElementById("preview-container").innerHTML; */
            console.log("started scanner", cameras[0]);
          }
          else { //if there is more than one camera open the rear/back camera
            vm.scanner.start(cameras[cameras.length-1]);
            /* document.getElementById("modalvid").innerHTML=document.getElementById("preview-container").innerHTML; */
            console.log("started scanner", cameras[cameras.length-1]);
          }
        }
        else {
          console.error("No cameras found.");
        }
      }).catch(function (e) {
        console.error(e);
      });
    }





    //
  }
})();
