(function (){
  'use strict';

  angular
    .module('gaddum.models')
    .factory('SharedProfile', SharedProfile)
  ;

  SharedProfile.$inject = [
    'profileService'
  ];

  function SharedProfile(
    profileService
  ) {

    function SharedProfile( avatarName, avatarGraphic, profileIUUID, fcmDeviceId ) {
      this.avatarName = avatarName;
      this.avatarGraphic = avatarGraphic;
      this.profileIUUID = profileIUUID;
      this.fcmDeviceId = fcmDeviceId;
    }

    var validations = {
      "avatarName":function validateAvatarName( name ) {
        if(angular.isString(name)===false) {
          return false;
        }
        if(name.length<1) {
          return false;
        }
        var nameParts = name.split(" ");
        if(nameParts.length!==2) {
          return false;
        }
        if(profileService.SETTINGS.fnames.indexOf(nameParts[0])===-1) {
          return false;
        }
        if(profileService.SETTINGS.lnames.indexOf(nameParts[1])===-1) {
          return false;
        }
        return true;
      },
      "avatarGraphic":function validateAvatarGraphic(graphic) {
        //if(graphic instanceof AvatarGraphic === false) {
        if(graphic instanceof Object === false) {
          return false;
        }
        if(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(graphic.getColour())===false) {
          return false;
        }
        if(angular.isArray(graphic.getValues())===false) {
          return false;
        }
        if(graphic.getValues().length!==8) {
          return false;
        }
        for(var i=0; i<8; i++) {
          if(angular.isNumber(graphic.getValues()[i])===false) {
            return false;
          }
          if(graphic.getValues()[i]<0 || graphic.getValues()[i]>255) {
            return false;
          }
        }
        return true;
      },
      "profileIUUID": function validateProfileIUUID( IUUID ) {
        if(angular.isString( IUUID )===false) {
          return false;
        }
        // validation via https://stackoverflow.com/questions/7905929/how-to-test-valid-uuid-guid
        if(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(IUUID)===false) {
          return false;
        }
        return true;
      },
      "fcmDeviceId": function validateFcmDeviceId( devId ) {
        // no published validation mechanism for this - see
        // https://stackoverflow.com/questions/12403628/is-there-a-gcm-registrationid-pattern
        if(angular.isString( devId )===false) {
          return false;
        }
        if(devId.length<1 || devId.length>4096) {
          return false;
        }
        return true;
      }
    };

    SharedProfile.build = function( data ) {
      var valid = true;
      var validationFailures = [];
      for(var propertyName in validations) {
        if( !validations[propertyName](data[propertyName]) ) {
          valid = false;
          validationFailures.push(propertyName);
        }
      }
      if(valid===false) {
        throw ("SharedProfileError: "+validationFailures.join(", ") );
      }
      return new SharedProfile(
        data.avatarName,
        data.avatarGraphic,
        data.profileIUUID,
        data.fcmDeviceId
      );
    };

    SharedProfile.create_from_vars = function create_from_vars( avatarName, avatarGraphic, profileIUUID, fcmDeviceId ) {
      var profile;
      try {
        profile = SharedProfile.build( {
          "avatarName": avatarName,
          "avatarGraphic": avatarGraphic,
          "profileIUUID": profileIUUID,
          "fcmDeviceId": fcmDeviceId
        } );
      } catch(error) {
        console.log( error );
        return;
      }
      return profile;
    };

    SharedProfile.create_from_scan = function create_from_scan( scanData ) {
      var profile;
      var data = JSON.parse( atob(scanData) );
      try {
        profile = SharedProfile.build( data );
      } catch (error) {
        console.log( error );
        return;
      }
      return profile;
    };

    return SharedProfile;

  }

})();
