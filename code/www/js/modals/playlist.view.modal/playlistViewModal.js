(function () {
    'use strict';

    angular
        .module('playlistViewModule', [])
        .factory('playlistViewModal', playlistViewModal);
    playlistViewModal.$inject = ['$ionicModal', '$rootScope' , '$timeout'];
    function playlistViewModal($ionicModal, $rootScope, $timeout) {
        var $scope = $rootScope.$new(),
            myModalInstanceOptions = {
                scope: null,
                focusFirstInput: true,
                controller: 'playlistViewModalController as vm',
                
            };
        $scope.$on("modal.hidden", function (modal) {
            close();
            
        });
        var modalSave = null;
        var parmeter = null;
        var closeCheck = null;
        var dataTracks = null;
        var dataPlaylist= null;

        var myModal = {
            open: open,
            close: close,
            getParams:getParams,
            callback:callback,
            closeCheckFalse:closeCheckFalse,
            data:data
        };
        return myModal;

        function open(params, fnCallbackOk, fnCallbackCancel) {
            var service = this;
            closeCheck=true;
            dataPlaylist = null;
            dataTracks = null;
            parmeter = params;
            $scope.fnCallbackOk = fnCallbackOk;
            $scope.fnCallbackCancel=fnCallbackCancel;
            $ionicModal.fromTemplateUrl(
                'js/modals/playlist.view.modal/playlistViewModal.html',
                myModalInstanceOptions
            ).then(function (modalInstance) {
                modalSave = modalInstance;
                service.close = function () {
                    closeAndRemove(modalInstance);
                    
                };
                service.modalInstance = modalInstance;
                return service.modalInstance.show();
            });
            
        }
        function getParams(){
            return parmeter;

            
        }
        function close() {
            if(closeCheck){
                if(modalSave){
                    $timeout(function(){
                        modalSave.remove();
                        modalSave = null;
                        $scope.fnCallbackCancel(dataTracks,dataPlaylist);
                        dataTracks = null;
                        dataPlaylist = null;
                    },500);
                    
                }
            }
            closeCheck = true;
        }
        function closeCheckFalse(){
            closeCheck = false;
        }
        function closeAndRemove(modalInstance) {
            return modalInstance.hide()
                .then(function () {
                    return modalInstance.remove();
                });
        };
        function data(tracks,playlist){
            dataPlaylist = playlist;
            dataTracks = tracks;
        }
        function callback(newData){
            $scope.fnCallbackOk(newData);
        };
    }
})();

