// NOTE: This file contains dummy values. The values for the original gaddum project are availble from the private repo:
// https://github.com/CMDT/gaddum/blob/master/authentication/
// 
// NOTE: The repo has this copy of the file, and will not allow it to be updated with another version. See:
// https://stackoverflow.com/questions/13630849/git-difference-between-assume-unchanged-and-skip-worktree#

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
           
            clientId: 'YOUR_CLIENT_ID',
            redirectShort: "http://localhost/callback",
            redirectUri: "http://localhost/callback.html",
            scopes: "streaming",
            authServiceUri: "https://accounts.spotify.com/authorize",
            exchangeServiceUri: "YOUR_URI",
            refreshServiceUri: "YOUR_URI"            
        };


        return service;

    }

    
})();