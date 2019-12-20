(function () {
    'use strict;'
  
    angular
      .module('gaddum.send',[] )
      .factory('sendService', sendService)
      ;
  
      sendService.$inject = [
      'PushMessage'
    ];
    function sendService(
        PushMessage
    ) {
      
      function sendMessage(pushMessage,sharedProfiles){
        console.log(decodeURIComponent(escape(window.atob(pushMessage.getPayload().getPayload()))));
        console.log("sendService has received pushMessage:",pushMessage," and sharedProfiles the first one being senders(aka users) second being the receiver:",sharedProfiles)
      }
  
      var service = {
          sendMessage:sendMessage
      };
  
      return service;
    }
  })();
  