(function () {
  'use strict';

  angular
    .module('gaddum.profileDirective')
    .controller('profileController', control);

  control.$inject = [
    '$state',
    '$q',
    'profileService',
    'profileEditModal',
    'gaddumContextMenuItem',
    'gaddumShortcutBarService',
    'ErrorIdentifier',
    '$timeout',
    'AvatarGraphic',
    '$ionicModal',
    '$scope',
    'spinnerService',
    '$ionicSlideBoxDelegate',
    'SharedProfile'
  ];

  function control(
    $state,
    $q,
    profileService,
    profileEditModal,
    gaddumContextMenuItem,
    gaddumShortcutBarService,
    ErrorIdentifier,
    $timeout,
    AvatarGraphic,
    $ionicModal,
    $scope,
    spinnerService,
    $ionicSlideBoxDelegate,
    SharedProfile
  ) {
    var vm = angular.extend(this, {
      scrollGenre: true,
      genresFontStyle: false,
      displayGenres: "",
      screenWidth: 0,
      busy: true,
      name: ""
    });

    var scale = 8;
    var DEFAULT_NAME = "Defaulthony Nameson";
    vm.userProfile = {
      "profile_id": "99999999-5500-4cf5-8d42-228864f4807a",
      "avatar_name": DEFAULT_NAME,
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
      "device_id": "dJUr6sA28ZY:A9A91bH-chjJ8lcq61ofrjoHjak3q6nCFALPGytdEsLzh2DacCx7ihhZHxd6pPSXYMhtx4MlcQekn1rzjB7c809aNzivPFu5jhA-SR6FWbvzfBsO8ySo6um8DVA9dgOgokzz0QU5vbEf"
    };

    vm.allGenres = [];
    vm.selecteGenres = [];
    vm.userGenres = "";

    function init() {
      vm.screenWidth = screen.width;
      vm.name = vm.userProfile.avatar_name;
      vm.busy = true;
      spinnerService.spinnerOn();
      asyncPopulateGenres().then(
        asyncPopulateProfile().then(
          function success(results) {
            vm.genreScrollChecker();
            vm.checkGraphic(vm.userProfile.avatar_graphic.values);
            if ((vm.userProfile.avatar_name == null || vm.userProfile.avatar_name == "" || vm.userProfile.avatar_name === DEFAULT_NAME) && profileService.getOpenModalFlag() == false) {
              profileService.setModalOpenFlag(true);
              vm.profileEdit();
            };
            vm.busy = false;
            vm.nameTextResizer();
            spinnerService.spinnerOff();
          },
          function fail(error) {
            vm.busy = false;
            vm.nameTextResizer();
            spinnerService.spinnerOff();
          }
        )
      );
      createModalList();
      gaddumShortcutBarService.setContextMenu(vm.conMenu);
    };

    vm.getName = function getName() {
      spinnerService.spinnerOn();
      asyncPopulateProfile().then(
        function success() {
          vm.name = vm.userProfile.profile.avatar_name;
          vm.nameTextResizer();
          spinnerService.spinnerOff();
        }, function (error) {
          spinnerService.spinnerOff();
          console.log(error);
        }
      );
    };

    function getEncodedProfile() {
      var deferred = $q.defer();
      profileService.asyncGetUserProfile().then(function(profile){
        var myProfile = SharedProfile.create_from_vars(profile[ profileService.SETTINGS.AVATAR_NAME ],
                                                       profile[ profileService.SETTINGS.AVATAR_GRAPHIC ],
                                                       profile[ profileService.SETTINGS.PROFILE_ID ],
                                                       profile[ profileService.SETTINGS.DEVICE_ID ]);
        deferred.resolve(
          btoa(
            JSON.stringify( myProfile )
          )
        );
      });
      return deferred.promise;
    }

    vm.setName = function setName(name) {
      spinnerService.spinnerOn();
      vm.name = name;
      document.getElementById("nameHeader").innerText=vm.name;
      return profileService.asyncSetAvatarName(name).then(
        function () {
          spinnerService.spinnerOff();

          setTimeout(function () {
            getEncodedProfile().then(function(profile){
              vm.encodedProfile = profile;
            });
          }, 0);
        }, function (error) {
          spinnerService.spinnerOff();
        }
      );
    };

    vm.getUserGenres = function getUserGenres() {
      return profileService.getUserGenres();
    };

    vm.setGenres = function setGenres(genres) {
      spinnerService.spinnerOn();
      return profileService.asyncSetGenres(genres).then(
        function () {
          vm.userGenres = genres;
          getEncodedProfile().then(function(profile){
            vm.encodedProfile = profile;
          });
          //vm.encodedProfile =btoa("{\"profile\": " + JSON.stringify({ profile_id: vm.userProfile.profile_id, avatar_name: vm.userProfile.avatar_name, avatar_graphic: vm.userProfile.avatar_graphic.getValues(), avatar_graphic_colour: vm.userProfile.avatar_graphic.getColour(), device_id: vm.userProfile.push_device_id }) + "}");
          vm.genreScrollChecker();
        }, function (error) {
          spinnerService.spinnerOff();
          console.log(error);
        }
      );
    };

    function asyncPopulateGenres() {
      var deferred = $q.defer();
      var promises = [];

      promises.push(profileService.asyncGetAllGenres());
      promises.push(profileService.asyncGetGenres());

      $q.all(promises).then(
        function success(results) {
          vm.allGenres = results[0];
          vm.selectedGenres = results[1];
          vm.userGenres = vm.selectedGenres;
          vm.displayGenres = vm.userGenres.join(", ");
          vm.genreScrollChecker();
          deferred.resolve();
        },
        function fail(error) {
          vm.allGenres = [];
          vm.selectedGenres = [];
          deferred.reject(error);
        }
      );

      return deferred.promise;
    }

    function asyncPopulateProfile() {
      var deferred = $q.defer();

      profileService.asyncGetUserProfile().then(
        function success(result) {
          angular.merge(vm.userProfile, result);
          if (result.avatar_name != null) {
            vm.name = result.avatar_name;
            try{
              document.getElementById("nameHeader").innerText=vm.name;
            } catch (error) {
              console.log("error in profile.controller.js! ",error);
            }
          } else {
            vm.name = DEFAULT_NAME;
            document.getElementById("nameHeader").innerText=vm.name;
          }
          vm.nameTextResizer();
          getEncodedProfile().then(function(profile){
            vm.encodedProfile = profile;
          });

          //vm.encodedProfile = btoa("{\"profile\": " + JSON.stringify({ profile_id: vm.userProfile.profile_id, avatar_name: vm.userProfile.avatar_name, avatar_graphic: vm.userProfile.avatar_graphic.getValues(), avatar_graphic_colour: vm.userProfile.avatar_graphic.getColour(), device_id: vm.userProfile.push_device_id }) + "}");
          deferred.resolve(true);
        },
        function fail(error) {
          deferred.reject(error);
        }
      );
      return deferred.promise;
    }

    function asyncLaunchModal() {
      var deferred = $q.defer();
      $timeout(
        function () {
          if (vm.checkGraphic(vm.userProfile.avatar_graphic.values)) {
            vm.userProfile.avatar_graphic.values = [0, 102, 102, 24, 24, 102, 102, 0];
            vm.userProfile.avatar_graphic.colour = "#FF00FF";
          }
          var modalParams = [
            { "allGenres": vm.allGenres },
            { "userGenres": vm.selectedGenres },
            { "userProfile": vm.userProfile }
          ];
          profileEditModal.open(modalParams, callback, refresh);
          deferred.resolve();
        }
      );

      return deferred.promise;
    }

    function asyncOpenClose() {
      var deferred = $q.defer();
      $timeout(
        function () {
          if (vm.checkGraphic(vm.userProfile.avatar_graphic.values)) {
            vm.userProfile.avatar_graphic.values = [0, 102, 102, 24, 24, 102, 102, 0];
            vm.userProfile.avatar_graphic.colour = "#FF00FF";
          }
          var modalParams = [
            { "allGenres": vm.allGenres },
            { "userGenres": vm.selectedGenres },
            { "userProfile": vm.userProfile },
            {"close":true}
          ];
          profileEditModal.open(modalParams, callback, refresh);
          deferred.resolve();
        },1000
      );

      return deferred.promise;
    }

    vm.checkGraphic = function (gValues) {
      var result = true;
      gValues.forEach(function (row) {
        if (row != 0) {
          result = false;
        }
      });
      return result;
    };

    function profileEdit() {
      asyncPopulateGenres().then(asyncPopulateProfile).then(asyncLaunchModal).then(function (){
        vm.genreScrollChecker();
      }, function (error) {
        console.log("profileEdit: ", error);
      });
    };
    function profileEdit2() {
      asyncPopulateGenres().then(asyncPopulateProfile).then(asyncOpenClose).then(function () { vm.genreScrollChecker(); }, function (error) { console.log(error); });
    };

    vm.saveGenreEdit = function saveGenreEdit(newGenres) {
      profileService.asyncSetGenres(newGenres);
    };

    vm.genreScrollChecker = function () {
      if (document.getElementById("genreStatic") && vm.userGenres != null && vm.userGenres != "" && vm.userGenres.length != 0) {
        vm.displayGenres = vm.userGenres.join(", ");
        var genreFont = document.getElementById("genreStatic").style.font;
        var genreText = vm.userGenres.join(", ");
        var maxNoScrollWidth = document.body.clientWidth - (document.getElementsByClassName("profileImageCanvas")[0].offsetWidth);

        if (textWidth(genreText, genreFont) > maxNoScrollWidth) {
          vm.scrollGenre = true;
          vm.displayGenres = vm.displayGenres + ", ";
        } else {
          vm.scrollGenre = false;
          
        }
      }
    };

    vm.nameTextResizer = function () {
      // THIS CAUSES SLOWDOWN
      // see https://bmt-systems.com/blog/preventing-forced-reflows-with-strategic-javascript-ii
      // https://gist.github.com/paulirish/5d52fb081b3570c81e3a
      // reading element widths is the main culprit
      if (document.getElementById("nameHeader") != null && document.getElementById("nameHeader") != "" && vm.name != null && vm.name != "") {
        var profileNameFont = document.getElementById("nameHeader").style.font;
        var nameText = vm.name;

        var maxNoScrollWidth = document.body.clientWidth - (85);
        for (var i = 0; i < 36; i++) {
          if (nameTextWidth(nameText, profileNameFont, i + "px") < maxNoScrollWidth) {
            //
          } else {
            var j = i - 2;
            document.getElementById("nameHeader").style.fontSize = j + "px";
            break;
          }
        }
      }
    };

    function nameTextWidth(text, fontProp, textFontSize) {
      var tag = document.createElement("div");
      tag.style.position = "absolute";
      tag.style.left = "-99in";
      tag.style.whiteSpace = "nowrap";
      tag.style.font = fontProp;
      tag.innerHTML = text;
      tag.style.fontSize = textFontSize;

      document.body.appendChild(tag);
      var result = tag.clientWidth;
      document.body.removeChild(tag);

      return result;
    }

    function textWidth(text, fontProp) {
      var tag = document.createElement("div");
      tag.style.position = "absolute";
      tag.style.left = "-99in";
      tag.style.whiteSpace = "nowrap";
      tag.style.font = fontProp;
      tag.innerHTML = text;

      document.body.appendChild(tag);
      var result = tag.clientWidth;
      document.body.removeChild(tag);

      return result;
    }

    vm.createProfileGraphic = function () {

      var canvas = document.getElementsByClassName("profileImageCanvas");
      canvas = canvas[canvas.length - 1];
      var ctx = canvas.getContext('2d');
      var nx = Math.floor(canvas.width / scale);
      var ny = Math.floor(canvas.height / scale);
      var bin;
      var profile;
      profileService.asyncGetUserProfile().then(
        function success(result) {
          var graphic = result.avatar_graphic.getValues();
          var colour = result.avatar_graphic.getColour();
          for (var j = 0; j < graphic.length; j++) {
            bin = graphic[j].toString(2);
            for (var x = bin.length; x < 8; x++) {
              bin = "0" + bin;
            }
            for (var k = 0; k < bin.length; k++) {
              if (bin[k] == "1") {
                rect(k, j, nx, ny, colour, ctx);
              } else {
                rect(k, j, nx, ny, '#ffffff', ctx);
              }
            }
          }
        },
        function fail(error) {
          // deferred.reject(error);
        }
      );
    };
    function rect(x, y, w, h, fs, ctx) {
      ctx.fillStyle = fs;
      ctx.fillRect(x * w, y * h, (w), h);
    };

    var callbackflag = false;//an idea for a flag to change the way the cancell callback runs when the confirm button is pressed

    function callback(profileDetails) {
      //update everything on screen
      if (vm.name==DEFAULT_NAME || vm.name == null || vm.name === "") {
        profileService.setFirstRunFlag(true);
      }
      vm.setName(profileDetails.name).then(
        vm.setAvatar_image(profileDetails.avatar_image, profileDetails.avatar_image_colour).then(
          vm.setGenres(profileDetails.genres).then(
            function onSuccess() {
              vm.genreScrollChecker();
              profileService.setModalOpenFlag(false);
              asyncPopulateProfile();
              setTimeout(function(){
                init();
                if (profileService.getFirstRunFlag()==true && profileDetails.name!="Defaulthony Nameson") {
                  profileService.setFirstRunFlag(false);
                  var slideCounter=0;
                  while ( $($("#main_wrapper").find("ion-slide")[slideCounter]).attr("ion-slide-tab-label") != "Mood") {
                    slideCounter++;
                  }
                  $ionicSlideBoxDelegate.slide(slideCounter)
                }
              }, 200);
            },
            function fail(error) {
              spinnerService.spinnerOff();
            })
        )
      );
    };

    function refresh() {
      profileService.setModalOpenFlag(false);
      //refresh all the things
      if ((vm.userProfile.avatar_name == null || vm.userProfile.avatar_name == "") && profileService.getOpenModalFlag() == false) {
        profileService.setModalOpenFlag(true);
        vm.profileEdit();
      };
      asyncPopulateProfile();
    };

    vm.setAvatar_image = function setAvatar_image(avatar_image, image_colour) {
      var avatar_graphic = AvatarGraphic.build(image_colour, avatar_image);
      spinnerService.spinnerOn();

      return profileService.asyncSetAvatarGraphic(avatar_graphic).then(
        function success(result) {
          vm.userProfile.avatar_graphic = avatar_graphic;
          vm.createProfileGraphic(avatar_graphic);
          spinnerService.spinnerOff();
        },
        function fail(error) {
          spinnerService.spinnerOff();
        });
    };

    function createModalList() {
      var firstVariable = "Edit Profile";
      var firstFunc = profileEdit;
      var contextMenu = [];
      contextMenu[0] = gaddumContextMenuItem.build(firstVariable, firstFunc);
      vm.conMenu = contextMenu;
    }

    vm.showQR = function showQR() {
      $ionicModal.fromTemplateUrl('js/directives/profileDirective/showQRCodeModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.modal = modal;
        $scope.modal.show();
      }, function (error) {
        console.log(error);
      });
    };

    // TODO: Error Handling
    vm.profileEdit = profileEdit;
    init();
  }
})();
