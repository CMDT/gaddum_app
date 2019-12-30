(function () {
  'use strict';

  angular
    .module('gaddum.login')
    .controller('loginModalController', loginModalController);

  loginModalController.$inject = [
    'loginModal',
    'selectorModal',
    '$scope',
    'gaddumMusicProviderService',
    'MusicProviderIdentifier',
    '$q',
    'spinnerService',
    'providerSettingsService'

  ];

  function loginModalController(
    loginModal,
    selectorModal,
    $scope,
    gaddumMusicProviderService,
    MusicProviderIdentifier,
    $q,
    spinnerService,
    providerSettingsService
  ) {


  

    function onLoginSuccess() {
      ac.busy = false;
      spinnerService.spinnerOff();
      loginModal.notifyLoginSuccess();
    }

    function onLoginFail() {
      ac.busy = false;
      spinnerService.spinnerOff();
    }

    function cancelLogin() {
      loginModal.notifyLoginFail();
    }

    function asyncLogin() {
      ac.busy = true;
      spinnerService.spinnerOn();
      console.log("setting music provider.");
      gaddumMusicProviderService.asyncSetMusicProvider(ac.selectedNamedIdentifier)
        .then(
          function () {
            console.log("requesting login.");
            gaddumMusicProviderService.asyncLogin().then(
              onLoginSuccess(),
              onLoginFail());
          },
          onLoginFail
        );
    }

    function asyncGetProviderInfoUrl(providerId){
      var deferred = $q.defer();

      providerSettingsService.asyncGet(providerId, 'homepage_url').then(
        deferred.resolve,
        deferred.reject
      );

      return deferred.promise;
    }


    function onSelectorResult(selectedNamedIdentifier) {
      ac.selectedNamedIdentifier = selectedNamedIdentifier;
      ac.loginEnabled = true;
      ac.infoEnabled = false;
      ac.providerInfo = "";
      asyncGetProviderInfoUrl(selectedNamedIdentifier)
      .then(function(infoUrl){
        ac.infoEnabled = true;
        ac.providerInfo = infoUrl;
      });
 
    }

    function onSelectorCancelled() {
      console.log("loginModalController.showSelector.callback.onCancel");
      ac.loginEnabled = false;
    }

    function asyncPopulateSelector() {
      var deferred = $q.defer();
      ac.busy = true;
      ac.selectedNamedIdentifier = gaddumMusicProviderService.getMusicProvider();

      gaddumMusicProviderService.asyncGetSupportedMusicProviders().then(
        function (result) {
          ac.serviceProviders = result;
          ac.busy = false;
          if(ac.serviceProviders.length > 0){
            if(!ac.selectedNamedIdentifier){
              ac.selectedNamedIdentifier = ac.serviceProviders[0];
            }
          }
          deferred.resolve(ac.selectedNamedIdentifier);
        },
        function (err) {
          ac.serviceProviders = [];
          ac.busy = false;
          deferred.reject()
        }
      );
  
      return deferred.promise;

    }



    function showSelector() {  
        selectorModal.open(ac.serviceProviders, onSelectorResult, onSelectorCancelled);
    }

    var ac = angular.extend(this, {
      // vars

      busy: false,
      loginEnabled: false,
      namedIdentifiers: [],
      selectedNamedIdentifier: {},
      serviceProviders:[],
      // funcs
      asyncLogin: asyncLogin,
      showSelector: showSelector,
      cancelLogin: cancelLogin
    });




    $scope.loginModal = loginModal;

    function init() {
      ac.busy = true;
      ac.loginEnabled = false;
      ac.infoEnabled = false;
      ac.providerInfo = "";
      asyncPopulateSelector().then(
        function(selection){
          onSelectorResult(selection);
        });
    }
    init();

  }
})();