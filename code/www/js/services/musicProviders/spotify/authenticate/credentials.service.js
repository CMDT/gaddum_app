(function () {
    'use strict';

    angular
        .module('authenticatejs')
        .factory('credentialsSrvc', credentialsSrvc);

        credentialsSrvc.$inject = [

        ];

    function credentialsSrvc(
 
    ) {

        var service = {
           
            clientId: '6448aa2b84b5413db90f4953c3d4dc29',
            redirectShort: "http://localhost/callback",
            redirectUri: "http://localhost/callback.html",
            scopes: "streaming",
            authServiceUri: "https://accounts.spotify.com/authorize",
            exchangeServiceUri: "https://gaddumauth-test.herokuapp.com:443/spotify/exchange",
            refreshServiceUri: "https://gaddumauth-test.herokuapp.com:443/spotify/refresh"            
        };


        return service;

    }

    
})();