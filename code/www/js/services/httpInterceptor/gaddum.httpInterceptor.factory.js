//alert("AWOOOOO");
console.log("gaddum.httpInterceptor alive");

(function(){
  'use strict';

  angular
    .module( 'gaddum.httpInterceptor', [ ] )
    .factory('dataApiRecoverer',['$q', function($q){
      var dataApiRecoverer = {
        responseError: function responseError(response){
          console.log("🚨gaddum.httpInterceptor: responseError, ", response);

          return $q.reject(response);
        },
        requestError: function requestError(rejectReason){
          console.log("🚨gaddum.httpInterceptor: requestError, ", rejectReason);

          return $q.reject(rejectReason);
        }
      };
      return dataApiRecoverer;
    }])

    .config(['$httpProvider', function($httpProvider) {
      $httpProvider.interceptors.push('dataApiRecoverer');
    }]);
})();
