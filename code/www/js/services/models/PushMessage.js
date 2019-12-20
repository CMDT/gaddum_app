(function () {
    'use strict';
  
    angular
      .module('gaddum.models')
      .factory('PushMessage', PushMessage)
      ;
  
      PushMessage.$inject = [
      'utilitiesService'
    ];
    function PushMessage(
      utilitiesService
    ) {
  
      function PushMessage( messageType, senderId, messageId, destinationId, payload, payloadFormatId ) {
        // Public properties, assigned to the instance ('this')
  //      this.id = id;
        this.PushMessage = {
          "messageType": messageType,
          "senderId": senderId,
          "messageId": messageId,
          "destinationId": destinationId,
          "payload": payload,
          "payloadFormatId": payloadFormatId
        };
  //      this.getId = function() {
  //        return this.id;
  //      };
        this.getPushMessage = function() {
          return this.PushMessage;
        };
        this.getMessageType = function(){
            return this.PushMessage.messageType;
        };
        this.getSenderId = function(){
            return this.PushMessage.senderId;
        };
        this.getMessageId = function(){
            return this.PushMessage.messageId;
        };
        this.getDestinationId = function(){
            return this.PushMessage.destinationId;
        };
        this.getPayload = function(){
            return this.PushMessage.payload;
        };
        this.getPayloadFormatId = function(){
            return this.PushMessage.payloadFormatId;
        };
        // this.setMessageType = function(value){
        //     this.PushMessage.messageType = value;
        // };
        // this.setSenderId = function(value){
        //     this.PushMessage.senderId = value;
        // };
        // this.setMessageId = function(value){
        //     this.PushMessage.messageId = value;
        // };
        // this.setDestinationId = function(value){
        //     this.PushMessage.destinationId = value;
        // };
        // this.setPayload = function(value){
        //     this.PushMessage.payload = value;
        // };
        // this.setPayloadFormatId = function(value){
        //     this.PushMessage.payloadFormatId = value;
        // };
      };
  
  
      /** 
       * Static method, assigned to class
       * Instance ('this') is not available in static context
       */
      PushMessage.build = function ( messageType, senderId, messageId, destinationId, payload, payloadFormatId) {
        return new PushMessage(
            messageType, senderId, messageId, destinationId, payload, payloadFormatId
        );
      };
  
  
      /**
       * Return the constructor function
       */
      return PushMessage;
  
    }
  })();
  