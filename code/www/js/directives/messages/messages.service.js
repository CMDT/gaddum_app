(function() {
  'use strict;'

  angular
    .module('gaddum.messages')
    .factory('messagesService', messagesService)
  ;

  messagesService.$inject = [
    '$http',
    '$q'
  ];
  function messagesService(
    $http,
    $q
  ) {
    var service={};

    service.messagesList = {};

    // dummy some data
    /* angular.merge(service.messagesList, {
      "1":{sender:1,
           state:1,
           dateTime:0,
           body:"First Message"
          },
      "2":{sender:1,
           state:2,
           dateTime:1,
           body:"Second Message"
          },
      "3":{sender:2,
           state:3,
           dateTime:2,
           body:"Third Message"
          }
    }); */

    service.getMessages= function(){
      var deferred= $q.defer();
    
      //vm.messagesList = messagesService.messagesList;
      /* vm.messages=[
        {"From":"11111111-5500-4cf5-8d42-228864f4807a","Content":"Sword 1","message_ID":"Aatrox","message_type":"connectionRequest","sender_name":"Darkin swordsman"},
        {"From":"22222222-5500-4cf5-8d42-228864f4807a","Content":"Fox 2","message_ID":"Ahri","message_type":"connectionResponse","sender_name":"Magic fox"},
        {"From":"33333333-5500-4cf5-8d42-228864f4807a","Content":"Ninja 3","message_ID":"Akali","message_type":"musicSharing","sender_name":"Balance Ninja"},
        {"From":"44444444-5500-4cf5-8d42-228864f4807a","Content":"Cow 4","message_ID":"Alistar","message_type":"connectionRequest","sender_name":"Free Cow"},
        {"From":"55555555-5500-4cf5-8d42-228864f4807a","Content":"Sad boi 5","message_ID":"Amumu","message_type":"connectionRequest","sender_name":"Sad Mummy"},
        ]; */

        /* angular.merge(service.messagesList, [ */
      service.messagesList = [
        {
          "name": "message1", "message": {
            sender: 1,
            state: 1,
            dateTime: 0,
            body: { "From": "11111111-5500-4cf5-8d42-228864f4807a", "Content": "MessageContent1", "message_ID": "MessageID1", "message_type": "connectionRequest" }
          },
        },
        {
          "name": "message2", "message": {
            sender: 2,
            state: 2,
            dateTime: 1,
            body: { "From": "22222222-5500-4cf5-8d42-228864f4807a", "Content": "MessageContent2", "message_ID": "MessageID2", "message_type": "connectionResponse" }
          }
        },
        {
          "name": "message3", "message": {
            sender: 3,
            state: 3,
            dateTime: 2,
            body: { "From": "33333333-5500-4cf5-8d42-228864f4807a", "Content": "MessageContent3", "message_ID": "MessageID3", "message_type": "musicSharing" },
          }
        },
        {
          "name": "message4", "message": {
            sender: 4,
            state: 3,
            dateTime: 3,
            body: { "From": "44444444-5500-4cf5-8d42-228864f4807a", "Content": "MessageContent4", "message_ID": "MessageID4", "message_type": "connectionRequest" }
          }
        },
        {
          "name": "message5", "message": {
            sender: 5,
            state: 3,
            dateTime: 4,
            body: { "From": "55555555-5500-4cf5-8d42-228864f4807a", "Content": "MessageContent5", "message_ID": "MessageID5", "message_type": "connectionRequest" },
          }
        },
        {
          "name": "message6", "message": {
            sender: 5,
            state: 4,
            dateTime: 5,
            body: { "From": "55555555-5500-4cf5-8d42-228864f4807a", "Content": "THIS MESSAGE TYPE HAS NO CONTENT", "message_ID": "MessageID5", "message_type": "connectionLost" },
          }
        }
      ];




        if (service.messagesList!=[]) {
          deferred.resolve(service.messagesList);
        } else{
         deferred.reject("failed in message service");
        }
        return deferred.promise;
    };

    return service;
  }
})();
