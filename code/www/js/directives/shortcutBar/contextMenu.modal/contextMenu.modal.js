(function () {
    'use strict';

    angular
        .module('gaddum.shortcutBar')
        .factory('gaddumContextMenuModal', gaddumContextMenuModal);//rename genModal
        gaddumContextMenuModal.$inject = ['$ionicModal', '$rootScope' , '$timeout'];
    function gaddumContextMenuModal($ionicModal, $rootScope , $timeout) {
        var $scope = $rootScope.$new(),
            myModalInstanceOptions = {
                scope: null,
                focusFirstInput: true,
                controller: 'gaddumContextMenuModalController as mc',
                animation: 'slide-in-up'
                
            };
        $scope.$on("modal.hidden", function (modal) {
            
            close();
            
        });
        var modalSave = null;
        var parmeter = null;

        var myModal = {
            open: open,
            close: close,
            getParams:getParams
        };
        return myModal;

        function open(params, fnCallbackOk, fnCallbackCancel) {
            var service = this;
            parmeter = params;
            $scope.fnCallbackOk = fnCallbackOk;
            $scope.fnCallbackCancel=fnCallbackCancel;
            $ionicModal.fromTemplateUrl(
                'js/directives/shortcutBar/contextMenu.modal/contextMenu.modal.html',
                myModalInstanceOptions
            ).then(function (modalInstance) {
                modalSave = modalInstance;
                service.close = function () {
                    closeAndRemove(modalInstance);
                    // $scope.fnCallbackOk();
                };
                service.modalInstance = modalInstance;
                return service.modalInstance.show();
            });
            
        }
        function getParams(){
            return parmeter;

            
        }
        function close() {
            if (modalSave){
                if(!modalSave._isShown){
                    $timeout(function(){
                        modalSave.remove();
                    },500);
                }
            }
        }
        function closeAndRemove(modalInstance) {
            return modalInstance.hide()
                .then(function () {
                    return modalInstance.remove();
                });
        };
    }
})();

