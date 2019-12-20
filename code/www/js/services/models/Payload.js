(function () {
    'use strict';
  
    angular
      .module('gaddum.models')
      .factory('Payload', Payload)
      ;
  
      Payload.$inject = [
      'utilitiesService'
    ];
    function Payload(
      utilitiesService
    ) {
  
      function Payload( payloadData ) {
        // Public properties, assigned to the instance ('this')
  //      this.id = id;
        this.payload = {
          "payloadData": window.btoa(unescape(encodeURIComponent(JSON.stringify(payloadData))))
        };
  //      this.getId = function() {
  //        return this.id;
  //      };
        this.getPayload = function() {
          return this.payload.payloadData;
        };
      };
  
  
      /** 
       * Static method, assigned to class
       * Instance ('this') is not available in static context
       */
      Payload.build = function ( payloadData) {
        return new Payload(
            payloadData
        );
      };
  
  
      /**
       * Return the constructor function
       */
      return Payload;
  
    }
  })();
  