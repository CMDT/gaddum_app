(function () {
  'use strict';

  angular
    .module('gaddum.main_ui')
    .controller('AboutModalController', AboutModalController);

    AboutModalController.$inject = [
      'AboutModal',
      '$scope',
      'aboutService'

  ];
  
  function AboutModalController(
    AboutModal,
    $scope,
    aboutService
  ) {
    var ac = angular.extend(this, {
      
    });

    ac.provider = aboutService.getProvider();
    ac.appVersion = aboutService.appVersion();
    ac.componentsLicenses = (aboutService.componentsLicenses()).licenses;
    ac.projectPersonnel = aboutService.projectPersonnel();
    ac.gaddumLink = aboutService.gaddumLink();
    ac.aboutText = aboutService.aboutText();
    ac.privacyStatement = aboutService.privacyStatement();

    $scope.AboutModal=AboutModal;
    function init() {
      ac.params =AboutModal.getParams();
      
    }
    init();
    
  }
})();