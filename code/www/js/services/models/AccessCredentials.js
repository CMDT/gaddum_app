(function () {
  'use strict';

  angular
    .module('gaddum.models')
    .factory('AccessCredentials', AccessCredentials)
    ;

  AccessCredentials.$inject = [

  ];
  function AccessCredentials(
  ) {

    var TOKEN_EXPIRY_GRACE_PERIOD_MS = 20000;

    function AccessCredentials(
      accessToken,
      expiresAt_ms,
      refreshToken
    ) {
      // Public properties, assigned to the instance ('this')
      this.accessToken = accessToken;
      this.expiresAt_ms = expiresAt_ms;
      this.refreshToken = refreshToken;
    

    this.getAccessToken = function() {
      return this.accessToken;
    }
    this.getExpiresAt = function() {
      return this.expiresAt_ms;
    }
    this.getRefreshToken = function() {
      return this.refreshToken;
    }

    this.hasExpired = function() {
      var currentTimeJavaEpoch_ms = Date.now();

      var result = currentTimeJavaEpoch_ms >= (this.expiresAt_ms - TOKEN_EXPIRY_GRACE_PERIOD_MS);

      return result;
    }

    }
    /** 
     * Static method, assigned to class
     * Instance ('this') is not available in static context
     */
    AccessCredentials.build = function (accessToken, expiresAt_ms, refreshToken) {
      var result = null;
      if (accessToken && expiresAt_ms && refreshToken) {


        result = new AccessCredentials(
          accessToken,
          expiresAt_ms,
          refreshToken
        );
      }
      return result;

    };

    /**
     * Return the constructor function
     */
    return AccessCredentials;

  }
})();
