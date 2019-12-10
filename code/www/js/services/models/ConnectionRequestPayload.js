(function () {
  'use strict';

  angular
    .module('gaddum.models')
    .factory('ConnectionRequestPayload', ConnectionRequestPayload)
    ;

  ConnectionRequestPayload.$inject = [
    'utilitiesService'
  ];
  function ConnectionRequestPayload(
    utilitiesService
  ) {

    function ConnectionRequestPayload( partyOneProfile, partyTwoProfile ) {
      // Public properties, assigned to the instance ('this')
//      this.id = id;
      this.payload = {
        "partyOneProfile": partyOneProfile,
        "partyTwoProfile": partyTwoProfile,
        //"uuid": utilitiesService.createUuid()
      };
//      this.getId = function() {
//        return this.id;
//      };
      this.getPayload = function() {
        return this.payload;
      };
    };


    /** 
     * Static method, assigned to class
     * Instance ('this') is not available in static context
     */
    ConnectionRequestPayload.build = function ( partyOneProfile, partyTwoProfile) {
      return new ConnectionRequestPayload(
        partyOneProfile, partyTwoProfile
      );
    };


    /**
     * Return the constructor function
     */
    return ConnectionRequestPayload;

  }
})();
