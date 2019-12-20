(function () {
    'use strict';

    angular
        .module('gaddum.share',[])
        .factory('shareWizard', shareWizard);//rename genModal
        shareWizard.$inject = ['$ionicModal', '$rootScope', '$timeout'];
    function shareWizard($ionicModal, $rootScope , $timeout) {
        var $scope = $rootScope.$new(),
            myModalInstanceOptions = {
                scope: null,
                focusFirstInput: true,
                controller: 'shareWizardModalController as sm',
                animation: 'slide-in-down'
                
            };
        $scope.$on("modal.hidden", function (modal) {
            
            close();
            
        });
        var modalSave = null;
        var parmeter = null;

        var myModal = {
            open: open,
            close: close,
            getParams:getParams,
            callback:callback
        };
        return myModal;

        function open(params, fnCallbackOk, fnCallbackCancel) {
            var service = this;
            parmeter = params;
            $scope.fnCallbackOk = fnCallbackOk;
            $scope.fnCallbackCancel=fnCallbackCancel;
            $ionicModal.fromTemplateUrl(
                'js/wizards/gaddum.share.wizard/share.modal.html',
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
        function callback(emotion){
            $scope.fnCallbackOk(emotion);
            
        }
        function close() {
            if (modalSave){
                if(!modalSave._isShown){
                    $timeout(function(){
                        modalSave.remove();
                        modalSave = null;
                        $scope.fnCallbackCancel();
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