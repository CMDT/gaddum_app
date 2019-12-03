(function () {
  'use strict';

  angular
    .module('editImageModalModule')
    .controller('editImageModalController', editImageModalController);

  editImageModalController.$inject = [
    '$scope',
    'editImageModal',
    'profileService'
  ];

  function editImageModalController(
    $scope,
    editImageModal,
    profileService
  ) {
    var vm = angular.extend(this, {
      showGenres: false
    });
    var encodedImg = [];
    var scale = 8;
    var fnames = [
      "Apple",
      "Apricot",
      "Asparagus",
      "Avocado",
      "Banana",
      "Blackberry",
      "Blueberry",
      "Boysenberry",
      "Breadfruit",
      "Elderberry",
      "Limeberry",
      "Cranberry",
      "Cantaloupe",
      "Cherry",
      "Citron",
      "Citrus",
      "Coconut",
      "Date",
      "Elderberry",
      "Fig",
      "Grape",
      "Grapefruit",
      "Jackfruit",
      "Guava",
      "Hawthorn",
      "Kiwi",
      "Lemon",
      "Lime",
      "Mango",
      "Melon",
      "Mulberry",
      "Nectarine",
      "Orange",
      "Papaya",
      "Passionfruit",
      "Peach",
      "Pear",
      "Pineapple",
      "Plum",
      "Prune",
      "Raisin",
      "Raspberry",
      "Tangerine",
      "Loquat",
      "Vanilla",
      "Dragon-Fruit"
    ];

    var lnames = [
      "Chutney",
      "Conserve",
      "Compote",
      "Confit",
      "Conserve",
      "Curd",
      "Fruit-Butter",
      "Fruit-Curd",
      "Fruit-Cheese",
      "Fruit-Spread",
      "Jam",
      "Jelly",
      "Marmalade",
      "Mincemeat",
      "Pickle",
      "Preserve",
      "Relish"
    ];
    var canvas_size = 8;

    var canvas;
    var canvas_wh = [];
    var draw_colour = undefined;
    var pixel_colours = [
      { r: 1, g: 1, b: 1, a: 1 },
      { r: 0, g: 0, b: 0, a: 1 }
    ];

    var colours = [
      ["Graphite", '#111111'],
      ["Peach", '#FF9977'],
      ["Taupe", "#119977"],
      ["Deep Ocean", "#115599"],
      ["Advocat", "#FFFF77"],
      ["Letterbox", "#FF4433"],
      ["Teastain", "#BBAA88"],
      ["Burgundy", "#553344"],
      ["Orange", "#DD6633"],
      ["Comback", "#446633"],
      ["Babluey", "#AA99FF"],
      ["Aqua", "#AADDFF"],
      ["Blush", "#FF6688"]
    ];
    vm.colourChoices = colours;
    vm.colourChoice = 0; // SET TO PROFILE CHOICE! @TODO!
    vm.colourStyle = {
      'font-weight': 900,
      'border-radius':'4px',
      'width':'auto',
      'min-width':'1rem',
      'height':'auto',
      'background-color': vm.colourChoices[vm.colourChoice][1]
    };
    vm.nextColour = function nextColour() {
      vm.colourChoice = (vm.colourChoice + 1) % (vm.colourChoices.length);
      vm.colourStyle['background-color'] = vm.colourChoices[vm.colourChoice][1];
      vm.updatePixelColour();
    };
    vm.prevColour = function prevColour() {
      vm.colourChoice = (vm.colourChoice + vm.colourChoices.length - 1) % (vm.colourChoices.length);
      vm.colourStyle['background-color'] = vm.colourChoices[vm.colourChoice][1];
      vm.updatePixelColour();
    };
    vm.updatePixelColour = function updatePixelColour() {
      var colourMapping = ["none", "r", "g", "b"];
      pixel_colours[1] = { "colour": vm.colourChoices[vm.colourChoice][1] };
      /* if(vm.colourChoices[vm.colourChoice][1].length <=6){
        for (var i = 1; i<4; i++) {
          pixel_colours[1][ colourMapping[ i ] ]  =
            (vm.colourChoices[vm.colourChoice][1].charCodeAt(i)<58?
             vm.colourChoices[vm.colourChoice][1].charCodeAt(i)-48 :
             vm.colourChoices[vm.colourChoice][1].charCodeAt(i)-55 )*(1/16);
        }
      }
      else{
        for (var i = 1; i<7; i = i+2) {
          pixel_colours[1][ colourMapping[ i ] ]  =
            (vm.colourChoices[vm.colourChoice][1].charCodeAt(i)<58?
             vm.colourChoices[vm.colourChoice][1].charCodeAt(i)-48 :
             vm.colourChoices[vm.colourChoice][1].charCodeAt(i)-55 )*(1/16);
        }
      } */

      try {
        var x = evt.targetTouches[0].pageX;
        return;
      } catch (e) {
        for (var x = 0; x < canvas_wh[0]; x++) {
          for (var y = 0; y < canvas_wh[1]; y++) {
            var draw_colour = findMatchingColour(getPixelColour(canvas, x, y));
            setPixel(canvas, x, y, pixel_colours[draw_colour]);
          }
        }
      }
    };

    var canvas_grid;
    var canvas_colour;
    var canvas_colour_ctx;
    var grid_colours = [
      'rgb(255,255,255);', 'rgba(128,128,192,50%)'
    ];

    $scope.editImageModal = editImageModal;
    function init() {
      //console.log("editImageModalController: init!");
      vm.params = editImageModal.getParams();
      if (vm.params[1].avatar_image_colour=="#FF00FF") {
        colours[colours.length] = ["Sucopi", vm.params[1].avatar_image_colour];
        vm.colourChoices = colours;
        vm.prevColour();
      } else{
        //
        while (pixel_colours[1].colour!=vm.params[1].avatar_image_colour) {
          vm.nextColour();
        }
      }

      vm.colourChoices = colours;

      //      console.log(vm.params);
      //      console.log("paramarams",vm.params);
      vm.avimg = vm.params[0].avatar_image;
      //      console.log("avimg",vm.avimg);
      loadEditor();
      //      vm.doClear=handle_clear;
      //      vm.doSave=handle_save;
      //      vm.doInvert=vm.handle_invert;
    }

    init();

    function loadEditor() {
      //console.log("runnung");
      setTimeout(function () {

        getCanvasSize();
        //        console.log(document.getElementById("canvas_holder"));
        document.getElementById("canvas_holder").style.width = String(canvas_wh[0] * 42) + "px";
        document.getElementById("canvas_holder").style.height = String(canvas_wh[1] * 42) + "px";

        //document.getElementById("img").style.width  = String( canvas_wh[0] * 3 )+"px";
        //document.getElementById("img").style.height = String( canvas_wh[1] * 3 )+"px";

        canvas = document.createElement('canvas');
        canvas.id = 'edit';
        canvas.width = canvas_wh[0];
        canvas.height = canvas_wh[1];

        //        canvas_colour = document.createElement('canvas');
        //        canvas_colour.id = 'canvas_colour';
        //        var canvas_colour_img = document.getElementById('canvas_colour_img');
        //        canvas_colour.width = canvas_colour_img.offsetWidth;
        //        canvas_colour.height = canvas_colour_img.offsetHeight;
        //        canvas_colour_ctx = canvas_colour.getContext('2d');

        //        canvas_colour.addEventListener('touchstart', changeColour, {passive:false});
        //        canvas_colour.addEventListener('touchmove', changeColour, {passive:false});
        //        canvas_colour.addEventListener('touchstop', changeColour, {passive:false});
        //dbg
        //        canvas_colour_ctx.fillStyle="rgb(255,255,128);"
        //        canvas_colour_ctx.beginPath();
        //        canvas_colour_ctx.moveTo(0, 0);
        //        canvas_colour_ctx.lineTo(200,200);
        //        canvas_colour_ctx.stroke();
        //end dng
        //        canvas_colour_ctx.drawImage( canvas_colour_img,0,0/*,canvas_colour_img.offsetWidth, canvas_colour_img.offsetHeight*/ );
        //        canvas_colour_img.style.display = "none";
        //        var canvas_colour_holder = document.getElementById('canvas_colour_holder');
        //        canvas_colour_holder.appendChild(canvas_colour);


        canvas_grid = document.createElement('canvas');
        canvas_grid.id = 'canvas_grid';
        canvas_grid.width = document.getElementById('canvas_holder').offsetWidth;
        canvas_grid.height = document.getElementById('canvas_holder').offsetHeight;
        var canvas_grid_ctx = canvas_grid.getContext('2d');
        canvas_grid_ctx.fillStyle = grid_colours[1];

        for (var i = 0; i <= canvas_wh[0]; i++) {
          canvas_grid_ctx.beginPath();
          canvas_grid_ctx.moveTo(canvas_grid.width / canvas_wh[0] * i, 0);
          canvas_grid_ctx.lineTo(canvas_grid.width / canvas_wh[0] * i, canvas_grid.height);
          canvas_grid_ctx.stroke();
        }
        for (var i = 0; i <= canvas_wh[1]; i++) {
          canvas_grid_ctx.beginPath();
          canvas_grid_ctx.moveTo(0, canvas_grid.height / canvas_wh[1] * i);
          canvas_grid_ctx.lineTo(canvas_grid.width, canvas_grid.height / canvas_wh[1] * i);
          canvas_grid_ctx.stroke();
        }
        var canvas_holder = document.getElementById('canvas_holder');

        canvas_holder.appendChild(canvas);
        canvas_holder.appendChild(canvas_grid);

        canvas_grid.addEventListener('touchstart', clickDown, { passive: false });
        //canvas_grid.addEventListener('mousedown', clickDown, {passive:false} );
        canvas_grid.addEventListener('touchmove', clickMove, { passive: true });
        //canvas_grid.addEventListener('mousemove', clickMove, {passive:false} );
        canvas_grid.addEventListener('touchend', clickEnd, { passive: true });
        //canvas_grid.addEventListener('mouseup', clickEnd, {passive:false} );

        //        var clear = document.getElementById('clear');
        //        var invert = document.getElementById('invert');
        //        clear.addEventListener('mouseup', handle_clear, false);
        //        invert.addEventListener('mouseup', handle_invert, false);

        var body = document.getElementById('profileImageEditModal');
        //        body.addEventListener('touchmove', clickMove, {passive:true} );
        //        body.addEventListener('mousemove', clickMove, {passive:true} );

        //        var save = document.getElementById('save');
        //        save.addEventListener('mouseup', handle_save, false);

        //        window.onpopstate = function(event) {
        //          restoreHash();
        //        };
        //do_clear();
        //        restoreHash();
        //        console.log("finish");
        loadImg();
      }, 0);
    }

    var loadImg = function loadImg() {
      var imgAsHash = "";
      imgAsHash += canvas_size + ",";
      imgAsHash += canvas_size + ":";
      vm.avimg.forEach(function (rowdata) {
        //console.log(rowdata);
        var temp = rowdata.toString(2);
        //console.log("temp",temp);
        if (temp !== 0) {
          if (temp.length < 8) {
            var buffer = "";
            for (var i = 0; i < 8 - temp.length; i++) {
              buffer += "0";
            }
            temp = buffer + temp;
          }
          imgAsHash += temp.split("").toString() + ",";
          //console.log("hash",imgAsHash);
        } else {
          imgAsHash += "0,0,0,0,0,0,0,0,";
        }
      });
      imgAsHash = imgAsHash.substring(0, imgAsHash.length - 1);
      var data = imgAsHash.substr(1).split(':');
      var size = data[0].split(',');
      var pixels = data[1].split(',');
      var pixel_index = 0;
      for (var y = 0; y < parseInt(size[1]); y++) {
        for (var x = 0; x < parseInt(size[1]); x++) {
          setPixel(canvas, x, y, pixel_colours[parseInt(pixels[pixel_index])]);
          pixel_index = pixel_index + 1;
        }
      }
      //updateThumb();
    };

    vm.handle_save = function handle_save() {
      //console.log("this is the save");
      saveHash();
      //console.log("Returning img in callback",encodedImg);
      editImageModal.imgUpdate(encodedImg, colours[vm.colourChoice][1]);
      editImageModal.close();
      /*
              var save_canvas = document.createElement('canvas');
              save_canvas.id = 'save';
              save_canvas.width = canvas_wh[0] * 100;
              save_canvas.height = canvas_wh[1] * 100;
              render_canvas(canvas, save_canvas);
      
              var lnk = document.createElement('a'), e;
              lnk.href = save_canvas.toDataURL();
      
              if (document.createEvent) {
                  e = document.createEvent("MouseEvents");
                  e.initMouseEvent("click", true, true, window,
                                   0, 0, 0, 0, 0, false, false, false,
                                   false, 0, null);
                  lnk.dispatchEvent(e);
              } else if (lnk.fireEvent) {
                  lnk.fireEvent("onclick");
              }*/
    };

    var do_clear = function do_clear() {
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = 'rgba(' + (pixel_colours[0].r * 255) + ',' +
        (pixel_colours[0].g * 255) + ',' +
        (pixel_colours[0].b * 255) + ',' +
        pixel_colours[0].a + ')';

      ;
      ctx.fillRect(0, 0, canvas_wh[0], canvas_wh[1]);
    };

    vm.handle_clear = function handle_clear() {
      //console.log("clear!");
      do_clear();
      updateThumb();
    };

    var saveHash = function saveHash() {
      var newHash = [];
      for (var y = 0; y < canvas_wh[1]; y++) {
        for (var x = 0; x < canvas_wh[0]; x++) {
          newHash.push(findMatchingColour(getPixelColour(canvas, x, y)));
        }
      }
      //window.location.hash = String(canvas_wh[0])+','+String(canvas_wh[1])+':'+newHash.join(",");
      encodedImg = [];
      var tempArray = [];
      var j = 1;
      var fullImgArray = [];
      for (var i = 0; i < newHash.length; i++) {
        fullImgArray.push(parseInt(newHash[i]));
      }

      for (var i = 0; i < newHash.length; i++) {
        if (i < (j * 8) - 1) {
          tempArray.push(newHash[i]);
        }
        if (i == (j * 8) - 1) {
          tempArray.push(newHash[i]);
          encodedImg[j - 1] = parseInt((tempArray.join('')), 2);
          j++;
          tempArray = [];
        }
      }
      editImageModal.imgUpdate(encodedImg, vm.colourChoices[vm.colourChoice][1]);
    };

    var render_canvas = function render_canvas(source, destination) {
      for (var x = 0; x < canvas_wh[0]; x++) {
        for (var y = 0; y < canvas_wh[1]; y++) {
          var draw_colour = findMatchingColour(getPixelColour(canvas, x, y));
          setPixel(destination, x, y, pixel_colours[draw_colour]);
        }
      }
    };

    var getCanvasSize = function getCanvasSize() {
      canvas_wh = [canvas_size, canvas_size];
      if (window.location.hash.indexOf(':') > 0) {
        var data = window.location.hash.substr(1).split(':');
        canvas_wh = data[0].split(",").map(function (val) {
          val = parseInt(val);
          return (val > 0 ? val : canvas_wh);
        });
      }
    };

    var restoreHash = function restoreHash() {
      if (window.location.hash.indexOf(':') > 0) {
        var data = window.location.hash.substr(1).split(':');
        var size = data[0].split(',');
        var pixels = data[1].split(',');
        var pixel_index = 0;
        for (var y = 0; y < parseInt(size[1]); y++) {
          for (var x = 0; x < parseInt(size[0]); x++) {
            setPixel(canvas, x, y, pixel_colours[parseInt(pixels[pixel_index])]);
            pixel_index = pixel_index + 1;
          }
        }
        updateThumb();
      }
    };

    vm.handle_invert = function handle_invert() {
      //console.log("handle_invert called");
      try {
        var x = evt.targetTouches[0].pageX;
        return;
      } catch (e) {
        for (var x = 0; x < canvas_wh[0]; x++) {
          for (var y = 0; y < canvas_wh[1]; y++) {
            var draw_colour = (pixel_colours.length - 1) - findMatchingColour(getPixelColour(canvas, x, y));
            setPixel(canvas, x, y, pixel_colours[draw_colour]);
          }
        }
        //        updateThumb();
      }
    };

    var updateThumb = function updateThumb() {
      //      saveHash();
    };

    var changeColour = function changeColour(event) {
      if ((event.target == canvas_grid) && (event.cancellable !== true)) {
        event.preventDefault();
      }
      var p = getScaledPosition(canvas_colour, event);
      var pixel = canvas_colour_ctx.getImageData(p.x, p.y, 1, 1).data;
      //console.log("r,g,b: ", pixel);
      //draw_colour = (pixel_colours.length-1) - findMatchingColour(getPixelColour(canvas,p.x, p.y));
      //clickMove(event);
    };

    var clickDown = function clickDown(event) {
      if ((event.target == canvas_grid) && (event.cancellable !== true)) {
        event.preventDefault();
      }
      var p = getScaledPosition(canvas, event);
      draw_colour = (pixel_colours.length - 1) - findMatchingColour(getPixelColour(canvas, p.x, p.y));
      clickMove(event);
    };

    var clickMove = function clickMove(event) {
      if ((event.target.id === "canvas_grid")/*&&(event.cancellable===false)*/) {
        if (draw_colour != undefined) {
          var p = getScaledPosition(canvas, event);
          setPixel(canvas, p.x, p.y, pixel_colours[draw_colour]);
          updateThumb();
        }
      } else {
        clickEnd(event);
      }
      if ((event.target == canvas_grid) && (event.cancellable)) {
        event.preventDefault();
      }
    };

    var clickEnd = function clickEnd(event) {
      draw_colour = undefined;
      if ((event.target == canvas_grid) && (event.cancellable === true)) {
        event.preventDefault();
      }
      saveHash();
      editImageModal.imgUpdate(encodedImg, colours[vm.colourChoice][1]);
    };

    var getScaledPosition = function getScaledPosition(canvas, evt) {
      var rect = canvas.getBoundingClientRect();
      try {
        var bodyRect = document.body.getBoundingClientRect();
        return {
          x: Math.floor((evt.targetTouches[0].pageX - rect.left + bodyRect.left) / rect.width * canvas.width),
          y: Math.floor((evt.targetTouches[0].pageY - rect.top + bodyRect.top) / rect.height * canvas.height)
        };
      } catch (error) {
        return {
          x: Math.floor((evt.clientX - rect.left) / rect.width * canvas.width),
          y: Math.floor((evt.clientY - rect.top) / rect.height * canvas.height)
        };
      }
    };

    var getPixelColour = function getPixelColour(canvas, x, y) {
      var canvas_ctx = canvas.getContext('2d');
      var pixel = canvas_ctx.getImageData(x, y, 1, 1);
      return {
        r: pixel.data[0],
        g: pixel.data[1],
        b: pixel.data[2],
        a: pixel.data[3]
        /* g: (pixel.data[0]+pixel.data[1]+pixel.data[2])/3 */
      };
    };

    var findMatchingColour = function findMatchingColour(c) {
      if (c.r == 255 && c.g == 255 && c.b == 255) {
        return 0;
      } else {
        return 1;
      }

      /* for(var i in pixel_colours) {
        var g = (c.r+c.g+c.b)/3/255;
        if( g === pixel_colours[i].g ) {
          return i;
        }
      }
      return 1; */
    };

    var setPixel = function setPixel(destination_canvas, x, y, rgb) {
      if (rgb.r) {
        rgb = rgb.colour;
        var canvas_ctx = destination_canvas.getContext('2d');
        canvas_ctx.imageSmoothingEnabled = false;
        canvas_ctx.fillStyle = "white";

        canvas_ctx.fillRect(x * (destination_canvas.width / canvas_wh[0]),
          y * (destination_canvas.height / canvas_wh[1]),
          destination_canvas.width / canvas_wh[0],
          destination_canvas.height / canvas_wh[1]);
      } else {
        rgb = rgb.colour;
        var canvas_ctx = destination_canvas.getContext('2d');
        canvas_ctx.imageSmoothingEnabled = false;
        canvas_ctx.fillStyle = rgb;
        /* 'rgb('+
          (rgb.substring)+','+
          (rgb[2])+','+
          (rgb[3])+')'; */

        canvas_ctx.fillRect(x * (destination_canvas.width / canvas_wh[0]),
          y * (destination_canvas.height / canvas_wh[1]),
          destination_canvas.width / canvas_wh[0],
          destination_canvas.height / canvas_wh[1]);
      }
      /* saveHash();
      editImageModal.imgUpdate(encodedImg, colours[vm.colourChoice][1]); */
    };
  }
})();
