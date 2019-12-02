(function () {
    'use strict';

    angular
        .module('openMessageModalModule',[])
        .factory('openMessageModal', openMessageModal);
    openMessageModal.$inject = ['$ionicModal', '$rootScope', '$timeout'];
    function openMessageModal($ionicModal, $rootScope, $timeout) {
        var $scope = $rootScope.$new(),
            myModalInstanceOptions = {
                scope: null,
                focusFirstInput: true,
                controller: 'openMessageModalController as vm'
            };
        $scope.$on("modal.hidden", function (modal) {
            close();
        });
        var modalSave = null;
        var parameter = null;
        var encodedImage = [];

        var myModal = {
          open: open,
          close: close,
          getParams: getParams,
          callback: callback,
          cancel: cancel,
          imgUpdate: imgUpdate,
          getEncodedImage: getEncodedImage,
          isOpen:false
        };

        return myModal;

      function open(params, fnCallbackOk, fnCallbackCancel) {
        myModal.isOpen = true;
            var service = this;

            parameter = params;
            $scope.fnCallbackOk = fnCallbackOk;
            $scope.fnCallbackCancel = fnCallbackCancel;
            $ionicModal.fromTemplateUrl(
                'js/directives/messages/modals/open_message_modal.html',
                myModalInstanceOptions
            ).then(function (modalInstance) {
                modalSave = modalInstance;
                service.close = function () {
                  closeAndRemove(modalInstance);
                  myModal.isOpen = false;
                };
                service.modalInstance = modalInstance;
                return service.modalInstance.show();
            });
        }
        function getParams() {
            return parameter;
        }
        function close() {
            if (modalSave) {

                $timeout(function () {
                    $scope.fnCallbackOk(encodedImage);
                    modalSave.remove();
                    modalSave = null;

                }, 500);

            }
        }
        function closeAndRemove(modalInstance) {
            return modalInstance.hide()
                .then(function () {
                    return modalInstance.remove();
                });
        }

        function callback(newData) {
            $scope.fnCallbackOk(encodedImage);
        }

        function imgUpdate(modalImage, modalColor) {
            encodedImage = [modalImage, modalColor];
        }

        function cancel() {
            //$scope.fnCallbackOk(encodedImage);
            $scope.fnCallbackCancel();
        }
        function getEncodedImage() {
            return encodedImage;
        }
    }
})();

