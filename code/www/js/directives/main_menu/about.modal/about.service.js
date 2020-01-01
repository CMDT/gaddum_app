(function () {
  'use strict;'

  angular
    .module('gaddum.main_ui')
    .factory('aboutService', aboutService)
    ;

  aboutService.$inject = [
    'gaddumMusicProviderService'
  ];
  function aboutService(
    gaddumMusicProviderService
  ) {


    function appVersion() {
      //   console.log(AppVersion.version);
      return AppVersion.version;
    }

    function getProvider(){
      
      var result = ""
      
      var provider = gaddumMusicProviderService.getMusicProvider();

      if(!!provider){
        result = provider.getName();
      }

      console.log("provider: " + provider);

      return result;

    }

    function componentsLicenses() {
      var licenseArray = {licenses:[
        {"name":"android-versions","version":"^1.4.0 ","link":"https://github.com/dvoiss/android-versions#readme "},
        {"name":"clean","version":"4.0.2  ","link":"https://github.com/kaelzhang/node-clean#readme"},
        {"name":"cordova-android","version":"6.3.0  ","link":"https://github.com/kaelzhang/node-clean#readme"},
        {"name":"cordova-browser","version":"5.0.4  ","link":"https://github.com/apache/cordova-browser#readme"},
        {"name":"cordova-custom-config","version":"^5.1.0  ","link":"https://github.com/dpa99c/cordova-custom-config#readme"},
        {"name":"cordova-ios","version":"4.5.5  ","link":"https://github.com/apache/cordova-ios#readme"},
        {"name":"cordova-plugin-add-swift-support","version":"^1.6.1  ","link":"https://github.com/akofman/cordova-plugin-add-swift-support"},
        {"name":"cordova-plugin-app-version","version":"^0.1.9  ","link":"https://github.com/whiteoctober/cordova-plugin-app-version#readme"},
        {"name":"cordova-plugin-appversion","version":"^1.0.0  ","link":"https://github.com/Rareloop/cordova-plugin-app-version"},
        {"name":"cordova-plugin-compat","version":"^1.2.0  ","link":"http://github.com/apache/cordova-plugin-compat#readme"},
        {"name":"cordova-plugin-console","version":"^1.1.0  ","link":"https://github.com/apache/cordova-plugin-console#readme"},
        {"name":"cordova-plugin-customurlscheme","version":"^4.4.0  ","link":"https://github.com/EddyVerbruggen/Custom-URL-scheme#readme"},
        {"name":"cordova-plugin-device","version":"^1.1.7  ","link":"https://github.com/apache/cordova-plugin-device#readme"},
        {"name":"cordova-plugin-file","version":"^4.3.3  ","link":"https://github.com/apache/cordova-plugin-file#readme"},
        {"name":"cordova-plugin-geolocation","version":"^2.4.3  ","link":"https://github.com/apache/cordova-plugin-geolocation#readme"},
        {"name":"cordova-plugin-inappbrowser","version":"^1.7.2  ","link":"https://github.com/apache/cordova-plugin-inappbrowser#readme"},
        {"name":"cordova-plugin-network-information","version":"^2.0.2  ","link":"https://github.com/apache/cordova-plugin-network-information#readme"},
        {"name":"cordova-plugin-screen-orientation","version":"^2.0.2  ","link":"https://github.com/apache/cordova-plugin-screen-orientation#readme"},
        {"name":"cordova-plugin-splashscreen","version":"^4.1.0  ","link":"https://cordova.apache.org/"},
        {"name":"cordova-plugin-statusbar","version":"^2.4.3  ","link":"https://github.com/apache/cordova-plugin-statusbar#readme"},
        {"name":"cordova-plugin-whitelist","version":"^1.3.4  ","link":"https://github.com/apache/cordova-plugin-whitelist#readme"},
        {"name":"cordova-spotify","version":"^0.5.8  ","link":"https://github.com/Festify/cordova-spotify#readme"},
        {"name":"cordova-spotify-oauth","version":"^0.1.11  ","link":"https://github.com/Festify/cordova-spotify-oauth#readme"},
        {"name":"cordova-sqlite-storage","version":"^3.2.1  ","link":"https://github.com/xpbrew/cordova-sqlite-storage"},
        {"name":"cordova.plugins.diagnostic","version":"^3.9.2  ","link":"https://github.com/dpa99c/cordova-diagnostic-plugin#readme"},
        {"name":"es6-promise-plugin","version":"^4.2.2  ","link":"https://github.com/vstirbu/PromisesPlugin#readme"},
        {"name":"gulp","version":"^4.0.2  ","link":"https://gulpjs.com"},
        {"name":"gulp-clean-css","version":"^4.2.0  ","link":"https://github.com/scniro/gulp-clean-css#readme"},
        {"name":"gulp-minify-css","version":"^1.2.4  ","link":"https://github.com/scniro/gulp-clean-css#readme"},
        {"name":"gulp-rename","version":"^1.4.0  ","link":"https://github.com/hparra/gulp-rename"},
        {"name":"ionic-plugin-keyboard","version":"^2.2.1  ","link":"https://github.com/driftyco/ionic-plugin-keyboard#readme"},
        {"name":"jquery","version":"^3.4.1  ","link":"https://jquery.com"},
        {"name":"natives","version":"^1.1.6  ","link":"https://github.com/addaleax/natives#readme"},
        {"name":"ngtouch","version":"^1.0.1  ","link":"https://github.com/nglar/ngTouch#readme"},
        {"name":"sass","version":"^1.22.9  ","link":"https://github.com/sass/dart-sass"},
        {"name":"uk.co.workingedge.cordova.plugin.sqliteporter","version":"^1.1.0 ","link":"https://github.com/dpa99c/cordova-sqlite-porter#readme"}]};
      //return "we got these things called licenses?";
      return licenseArray;
    }
    function projectPersonnel() {
      return ["Laurie Cooper", "Kei Gibbings", "Dave Mee","Jothan Taylor"];
    }
    function gaddumLink() {
      return "Gaddum";
    }
    function aboutText(){
      /* Feeding this into the template - ignore this */
      var txtstr="Hi there. Welcome to the Gaddum app! This app is brought to you by fine people of Gaddum and the students of DigitalLabs@MMU. This app is built to make you feel better with music and to help you spread the love by sharing. We're developing it with the help of funding from both Gaddum and MMU. Our first feature set is now ready for you to try out; it's all about finding out how you feel, and finding music to help. Currently, the music is provided by Spotify, so you'll need a Spotify account. The app will nag you to log-in and won't do anything much, until you do! When the app starts, you find you can create a Profile. This will become more important as the app develops, but right now the most important thing is 'Genres'. You can choose from a long list all the types of music you like. When you've done that, you can hop over to the Mood tab. Here's where you can use the app to get music to fit how you're feeling. The first thing you can try is the Mood recogniser. We use some AI to look at your face, through the selfie camera, and find out what expression you have. We can tell the difference between 10 different emotions. Sort of. Give it a go and see how many you can find. The feature's a bit experimental, so if you can't get it to work for you, just choose one from the list below it instead. Once you've chosen your mood, choose 'That's me!'. The app uses a mixture of Spotify's suggestions and what you listened to before, to get tracks you might like. There are lots of other ways to get music - you can go to playlists, and import a Spotify Playlist. You can search and browse Spotify's tracks, and then add them to your own playlists. You can add tracks from one playlist to another. When you decide to play from a playlist, the app will ask you how you're feeling. That's so we can add observations about what music suits what mood for you. Feel uncomfortable about the app knowing how you feel? That's no problem. The main menu is at the top right of the app. From there, you can choose 'Settings'. Switch off anything you're not happy with."
      /*  Privacy statement:This version, Phase 1: You give permission for the app to access your Spotify account.The app reads and plays tracks using your account. The app does not affect any of its privacy settings.You can choose to enable the storage of observations in the app.Observations include: the track you listened to, the time and date, your location and your mood and whether you liked the track.You can switch off any of this data gathering. No data gathered by this app is shared with any third-party.Future, Phase 2This app will enable connection with friends and the sharing of playlists.Observations for each track in a playlist can be shared, so you can share 'why' a track is special to you.Again, you will be able to choose what data you want to share." */
      
      return txtstr;
    };
    function privacyStatement(){
      /* feeding this into the template - ignore this */
      var txtstr='This version, Phase 1: You give permission for the app to access your Spotify account.The app reads and plays tracks using your account. The app does not affect any of its privacy settings.You can choose to enable the storage of observations in the app. Observations include: the track you listened to, the time and date, your location and your mood and whether you liked the track.You can switch off any of this data gathering. No data gathered by this app is shared with any third-party.Future, Phase 2: This app will enable connection with friends and the sharing of playlists. Observations for each track in a playlist can be shared, so you can share \'why\' a track is special to you.Again, you will be able to choose what data you want to share.';
      
    return txtstr;

    };
    var service = {
      appVersion: appVersion,
      getProvider: getProvider,
      componentsLicenses: componentsLicenses,
      projectPersonnel: projectPersonnel,
      gaddumLink: gaddumLink,
      aboutText: aboutText,
      privacyStatement: privacyStatement
    };

    return service;
  }
})();
