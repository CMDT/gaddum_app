(function () {
  'use strict';

  angular
    .module('modalsProfile')
    .controller('profileEditModalController', profileEditModalController);

  profileEditModalController.$inject = [
    'profileEditModal',
    '$scope',
    'editImageModal',
    'genresCheckboxModal',
    'profileService.js'

  ];

  function profileEditModalController(
    profileEditModal,
    $scope,
    editImageModal,
    genresCheckboxModal,
    profileService
  ) {
    var vm = angular.extend(this, {
      showGenres: false,
      updateGenres:[],
      allGenres:[],
      pictureColor:"#FF00FF",
      defaultName:false,
      defaultImage:false,
      isProfileGraphicEditOpen:false
    });
    var scale = 8;
    //vm.fullName;
    //vm.displayImage;
    var newGenres = [];
    var profile;
    $scope.profileEditModal = profileEditModal;

    function init() {
      vm.params = profileEditModal.getParams();

      initialiseGenres();
      vm.fullName = vm.params[2].userProfile.avatar_name;
      newGenres = vm.params[1].userGenres;
      profile = vm.params[2].userProfile;
      vm.displayImage = profile.avatar_graphic.values;
      if (profile.avatar_graphic.colour != null) {
        vm.pictureColor = profile.avatar_graphic.colour;
      };
      if (vm.displayImage.every(emptyArrayCheck)||vm.displayImage===null||vm.displayImage.join()=="0,102,102,24,24,102,102,0") {
        vm.displayImage=[0, 102, 102, 24, 24, 102, 102, 0];
        vm.defaultImage=true;
      }
      if (vm.fullName===null||vm.fullName===""||vm.fullName=="Defaulthony Nameson") {
        vm.fullName="Defaulthony Nameson";
        vm.defaultName=true;
      }
      vm.genresAsString=vm.params[1].userGenres.join(", ");
      
//      console.log(vm.params);
      genresCheck();

      // if(vm.params[3]){
      //   console.log("should close");
      //   var newData = {
      //     "name": vm.fullName,
      //     "genres": newGenres,
      //     "avatar_image":vm.displayImage,//edit image 3/?
      //     "avatar_image_colour":vm.pictureColor
      //   };
      //  console.log(newData);
      //   profileEditModal.callback(newData);
      //   profileEditModal.close();
      // }
    }
    function emptyArrayCheck(item){
        return item===0;
    }
    function initialiseGenres() {
//      console.log("init genres", vm.params[0].allGenres);
      vm.params[0].allGenres.forEach(function (element) {
        if (newGenres.includes(element)) {
          vm.allGenres.push({ "Name": element, "Value": true });
        } else {
          vm.allGenres.push({ "Name": element, "Value": false });
        }
      });
//      console.log("all G", vm.allGenres);
    }

    init();

    vm.toggleGenres = function () {
      vm.showGenres = !vm.showGenres;
      if (vm.showGenres) {
        vm.matchCheckboxes();
      } else {
        vm.checkboxCheck();
      }
    };

    vm.newName = function () {
      var fname = profileService.SETTINGS.fnames[Math.floor(Math.random() *
                                                            profileService.SETTINGS.fnames.length)];
      var lname = profileService.SETTINGS.lnames[Math.floor(Math.random() *
                                                            profileService.SETTINGS.lnames.length)];
      vm.fullName = fname + " " + lname;
      // setTimeout(function(){  vm.defaultName=false; $scope.$apply(); }, 0);
      vm.defaultName=false;
    };

    vm.checkboxCheck = function () {
      var label;
      newGenres = [];
      vm.params[0].allGenres.forEach(function (genre) {
        label = document.getElementById("checkbox_" + genre).querySelector("input");
//        console.log(label.checked);
        if (label.checked === true) {
          newGenres.push(genre);
        }
      });
//      console.log("new");
//      console.log(newGenres);
//      console.log("old");
//      console.log(vm.params[1].userGenres);

      vm.params[1].userGenres = newGenres;
    };

//    vm.genresAsString;

    vm.getGenresAsString = function getGenresAsString() {
      //console.log("updg",vm.updateGenres);
      if (vm.updatedGenres !== null) {
        newGenres = vm.updatedGenres;
        vm.genresAsString= vm.updatedGenres.join(", ");
      } else {
        newGenres = vm.params[1].userGenres;
        vm.genresAsString=vm.params[1].userGenres.join(", ");
        if (vm.genresAsString==="") {
          vm.genresAsString="No Genres Chosen";
        }
      }
      genresCheck();
    };
    function genresCheck(){
      if (vm.genresAsString==null||vm.genresAsString==="") {
        vm.genresAsString="No Genres Chosen";
        vm.defaultGenres = true;
      } else {
        vm.defaultGenres = false;
      }
      testGenresButton();
    }
    function testGenresButton() {
      var btnString = vm.genresAsString;
      var btnStringAsArray = btnString.split('');
      var empty = true;
      if (vm.genresAsString === null || vm.genresAsString === "") {
        empty = true;
      } else {
        btnStringAsArray.forEach(function (letter) {
          if (/^[a-zA-Z]/.test(letter)) {
            empty = false;
          }
        });
      }
      if (empty == true) {
        btnString = vm.genresAsString = "No Genres Chosen"
      }
      //!/[^a-z]/i.test(str);;
    };

    vm.matchCheckboxes = function matchCheckboxes( ) {
      var label;
      vm.params[0].allGenres.forEach(function(genre) {
        label = document.getElementById("checkbox_" + genre).querySelector("input");
//        console.log(label.checked);
        if (vm.params[1].userGenres.includes(genre)) {
          label.checked = true;
        } else {
          label.checked = false;
        }
      });
    };

    vm.returnData = function () {
      var newData = {
        "name": vm.fullName,
        "genres": newGenres,
        "avatar_image":vm.displayImage,//edit image 3/?
        "avatar_image_colour":vm.pictureColor
      };
//      console.log(newData);
      profileEditModal.callback(newData);
      profileEditModal.close();
    };

    vm.cancel = function () {
      profileEditModal.cancel();
      profileEditModal.close();
    };

    vm.createProfileGraphic = function (id) {
      setTimeout(function () {
        //console.log("profile", profile);
        //console.log(document.getElementsByClassName("editPageProfileCanvas"));
        var canvas = document.getElementsByClassName("editPageProfileCanvas")[0];

        //        console.log(canvas.length);
//        console.log("createProfileGraphic: canvas = ",canvas);
//        canvas = canvas[canvas.length - 1];
        var ctx = canvas.getContext('2d');
        var nx = Math.floor(canvas.width / scale);
        var ny = Math.floor(canvas.height / scale);
        var bin;
//        console.log(id);
//        console.log(vm.friends);

        for (var j = 0; j < vm.displayImage.length; j++) {
          bin = vm.displayImage[j].toString(2);
          for (var x = bin.length; x < 8; x++) {
            bin = "0" + bin;
          }
//          console.log(bin);
          for (var k = 0; k < bin.length; k++) {
            if (bin[k] == "1") {
              rect(k, j, nx, ny, vm.pictureColor, ctx);
            } else {
              rect(k, j, nx, ny, '#ffffff', ctx);
            }
          }
        }
      }, 0);
    };

    function rect(x, y, w, h, fs, ctx) {
      ctx.fillStyle = fs;
      ctx.fillRect(x * w, y * h, (w), h);
    }

    vm.profileImageEdit = function profileImageEdit() {
      vm.isProfileGraphicEditOpen = true;
      var modalParams = [
        {"avatar_image":vm.displayImage},
        {"avatar_image_colour":vm.pictureColor}
      ];
      
      /* if (vm.displayImage.length==8) {
        var modalParams = [
          {"avatar_image":vm.displayImage},
          {"avatar_image_colour":vm.pictureColor}
        ];
      } else{
        var modalParams = [
          {"avatar_image":[0,102,102,24,24,102,102,0]},
          {"avatar_image_colour":"FF00FF"}
        ];
      } */
      
      //      console.log("displat img",vm.displayImage);
      editImageModal.open(modalParams, vm.updateImage, vm.imgUpdateCancel);
      //var,ok,c
      profileEditModal.closeCheckFalse();
    };

    vm.updateImage = function updateImage(newImage){
      //edit image 4/?
      vm.displayImage=newImage[0];
      vm.pictureColor=newImage[1];
      vm.createProfileGraphic();
      vm.defaultImage=false;
      vm.isProfileGraphicEditOpen = false;
    };

    vm.imgUpdateCancel = function imgUpdateCancel(image){
      //JJJJJ
//      console.log(image);
      vm.displayImage=image[0];
      vm.pictureColor=image[1];
      vm.createProfileGraphic();
      vm.isProfileGraphicEditOpen = false;
    };

    vm.showGenreCheckboxModal = function showGenreCheckboxModal() {
      //var checkboxPosition=document.getElementById('genreToggle').style;
//      console.log("new genres",newGenres);
      var modalParams = [
        {"allGenres":/* vm.params[0]. */vm.allGenres},
        {"userGenres":newGenres}
        //{"checkboxPosition":checkboxPosition}
      ];
      genresCheckboxModal.open(modalParams, vm.updateGenres, vm.genresUpdateCancel);
      //var,ok,c
      profileEditModal.closeCheckFalse();
    };

    vm.updateGenres = function updateGenres(genresData){
//      console.log("newg",genresData);
      vm.updatedGenres=genresData.genres;
      vm.defaultGenres = false;
    };

    vm.genresUpdateCancel=function genresUpdateCancel(genres){
//      console.log(genres);
      if (genres!==null) {
        var gArray =[];
        genres.forEach(function (element) {
          if (element.Value) {
            gArray.push(element.Name);
          }
        });
//        console.log("ga",gArray);
        vm.updatedGenres=gArray;
        vm.getGenresAsString();
      }
    };

    
  }
})();
