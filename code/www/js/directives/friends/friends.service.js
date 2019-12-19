

(function () {
    'use strict';

    angular
        .module('gaddum.friends')
        .factory('friendsService', friendsService);

    friendsService.$inject = [
        '$q',
        'connectionService'
         
    ];

    function friendsService(
      $q,
      connectionService
        
    ) {

        function beginFriend(sharedProfile){
          var deferred = $q.defer();
          connectionService.requestConnection(sharedProfile).then(function(){
            deferred.resolve(sharedProfile);
          },
          function(){
            deferred.reject("connection request failed");
          });
          return deferred.promise;

        }

        var MAX_CONNECTIONS = 50;

        function searchFriendsByID(searchID){
          //replace to get all friends from database then search them by id
          var deferred = $q.defer();
          var foundProfile=null;
          for(var i = 0 ; i<friendsDummy.length; i++){
            if(friendsDummy[i].profile.profile_id==searchID){
              foundProfile=friendsDummy[i];
            }
          }
          if (!foundProfile) {
            deferred.reject("couldn't find profile");
          }else{
            deferred.resolve(foundProfile);
            
          }
          return deferred.promise;
        }



        var friendsDummy=[
      
            {"profile": {
              "profile_id": "11111111-5500-4cf5-8d42-228864f4807a",
              "avatar_name": "Pineapple Fruit-Butter",
              "avatar_graphic":
                {"values":[
                  0,
                  0,
                  0,
                  24,/* 60 */
                  24,
                  0,
                  0,
                  0
                ],
                "colour":"#FF00FF"},
              /* "avatar_graphic": [
                0,
                0,
                0,
                24,
                24,
                0,
                0,
                0
              ],
              "avatar_graphic_colour":"#FF00FF", */
              device_id: "dJUr6sA28ZY:A1A91bH-chjJ8lcq61ofrjoHjak3q6nCFALPGytdEsLzh2DacCx7ihhZHxd6pPSXYMhtx4MlcQekn1rzjB7c809aNzivPFu5jhA-SR6FWbvzfBsO8ySo6um8DVA9dgOgokzz0QU5vbEf"
            }},
            {"profile": {
              "profile_id": "22222222-5500-4cf5-8d42-228864f4807a",
              "avatar_name": "Strawberry Jam",
              "avatar_graphic":
                {"values":[
                0,
                96,
                96,
                0,
                0,
                6,
                6,
                0,
                
                /* 0,
                102,
                102,
                24,
                24,
                66,
                126,
                0 */
              ],
              "colour":"#FF00FF"},
              /* "avatar_graphic_colour":"#FF00FF", */
              device_id: "dJUr6sA28ZY:A2A91bH-chjJ8lcq61ofrjoHjak3q6nCFALPGytdEsLzh2DacCx7ihhZHxd6pPSXYMhtx4MlcQekn1rzjB7c809aNzivPFu5jhA-SR6FWbvzfBsO8ySo6um8DVA9dgOgokzz0QU5vbEf"
            }},
            {"profile": {
              "profile_id": "33333333-5500-4cf5-8d42-228864f4807a",
              "avatar_name": "Raspberry Puree",
              "avatar_graphic":
                {"values":[
                0,
                96,
                96,
                24,
                24,
                6,
                6,
                0
              ],
              "colour":"#FF00FF"},
              /* "avatar_graphic_colour":"#FF00FF", */
              device_id: "dJUr6sA28ZY:A3A91bH-chjJ8lcq61ofrjoHjak3q6nCFALPGytdEsLzh2DacCx7ihhZHxd6pPSXYMhtx4MlcQekn1rzjB7c809aNzivPFu5jhA-SR6FWbvzfBsO8ySo6um8DVA9dgOgokzz0QU5vbEf"
            }},
            {"profile": {
              "profile_id": "44444444-5500-4cf5-8d42-228864f4807a",
              "avatar_name": "Apple Curd",
              "avatar_graphic":
                {"values":[
                0,
                102,
                102,
                0,
                0,
                102,
                102,
                0
              ],
              "colour":"#FFFF00"},
              /* "avatar_graphic_colour":"#FF00FF", */
              device_id: "dJUr6sA28ZY:A4A91bH-chjJ8lcq61ofrjoHjak3q6nCFALPGytdEsLzh2DacCx7ihhZHxd6pPSXYMhtx4MlcQekn1rzjB7c809aNzivPFu5jhA-SR6FWbvzfBsO8ySo6um8DVA9dgOgokzz0QU5vbEf"
            }},
            {"profile": {
              "profile_id": "55555555-5500-4cf5-8d42-228864f4807a",
              "avatar_name": "Banana Fruit-Spread",
              "avatar_graphic":
                {"values":[
                0,
                102,
                102,
                24,
                24,
                102,
                102,
                0
              ],
              "colour":"#FF00FF"},
              /* "avatar_graphic_colour":"#FF00FF", */
              device_id: "dJUr6sA28ZY:A5A91bH-chjJ8lcq61ofrjoHjak3q6nCFALPGytdEsLzh2DacCx7ihhZHxd6pPSXYMhtx4MlcQekn1rzjB7c809aNzivPFu5jhA-SR6FWbvzfBsO8ySo6um8DVA9dgOgokzz0QU5vbEf"
            }},
          ];
        var service = {
               deleteFriends,
               getAllFriends,
               searchFriends,
               searchFriendsByID,
               beginFriend
        };
        function searchFriends(input){
          var deferred = $q.defer();
          var tempFriends = [];
          var j = 0;
          if (input == null) {
            deferred.resolve(friendsDummy);
          } else {
            for (var i = 0; i < friendsDummy.length; i++) {
              // console.log(friendsDummy[i].profile.avatar_name)
              // console.log(input + " included in " + friendsDummy[i].profile.avatar_name + " = " + friendsDummy[i].profile.avatar_name.includes(input))
              if (friendsDummy[i].profile.avatar_name.toLowerCase().includes(input.toLowerCase())) {
                tempFriends[j] = friendsDummy[i];
                j++;
              }
            }
            deferred.resolve(tempFriends);
          }
          return deferred.promise;
        }

        function getAllFriends(){
            return friendsDummy;
        }
        function deleteFriends(index){
            delete friendsDummy[index];
            var tempFriends=[];
            var j=0;
            for (var i = 0; i < friendsDummy.length; i++) {
          if (friendsDummy[i]!=null) {
            tempFriends[j] = friendsDummy[i];
          j++;
          }
          
          
        }
        friendsDummy = tempFriends;
        }

        

        service.addNewFriend=function(sharedProfile){
            //create friend
            //were pretending that the encryption thing retuned already
            /* return new Promise((resolve,reject)=>{
                if ((sharedProfile.profile.profile_id.length)>3) {
                
                    resolve({"sent":true,
                            "message":"added"
                        });
                }else{
                    reject(
                        {"sent":false,
                        "message":"invalid profile, request not sent"
                        });
                }

            }) */
            
            
            
            // console.log(sharedProfile);
            if ((sharedProfile.profile.profile_id.length)>3) {
                //req sent
                //return req sent
                friendsDummy.push(sharedProfile);
                return true;
            } else{
                //req not sent
                //return req not sent
                return false;
            }
            /* friend_connectionSrvc.hasConnection(sharedProfile.profile.profile_id); */
        }

        /* var profileJson= {
            "profile": {
              "profile_id" : "76d47141-5500-4cf5-8d42-228864f4807a", 
              "avatar_name": "Strawberry Jam",
              "avatar_graphic": [
                255,
                0,
                255,
                0,
                255,
                0,
                255,
                0
              ],
              device_id: "dJUr6sA28ZY:APA91bH-chjJ8lcq61ofrjoHjak3q6nCFALPGytdEsLzh2DacCx7ihhZHxd6pPSXYMhtx4MlcQekn1rzjB7c809aNzivPFu5jhA-SR6FWbvzfBsO8ySo6um8DVA9dgOgokzz0QU5vbEf"
            }} */

        service.getFriends=function(searchTerm){
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            //getFriends
            //send UUID off to for database search
            //return profile
            
              //search
              /* resultArray[0]="76d47141-5500-4cf5-8d42-228864f4807a";
              return resultArray; */
              
              
              
              
              /* regex=new RegExp (str.toLowerCase(searchTerm));
              if (regex.test(str.toLowerCase(profileJson.profile.profile_id))) {
                resultArray[0]=profileJson;
              } else{
                  resultArray=null;
              }
              return resultArray; */
            
        }

        service.deleteFriend=function(ProfileUUID){
            //delete friend
            var boolreturn=false;
            if (ProfileUUID>0) {
                // console.log("Friend "+ProfileUUID+" deleted");
                boolreturn=true;
            } else {
                // console.log("Friend not deleted(invalid UUID");
                boolreturn= false;
            }
            return boolreturn;
        }
        return service;
    }
})();






