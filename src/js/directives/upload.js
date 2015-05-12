(function() {
    'use strict';

    angular
        .module('upload', ['angularFileUpload', 'alert'])
        .directive('uploadFile', uploadFile);


    /* @ngInject */
    function uploadFile(FileUploader, msgService) {
        return {
            restrict: 'E',
            scope: { ngModel: '='},
            template: '<input type="file" nv-file-select uploader="uploader" /><input type="hidden" ng-model="ngModel">',
            compile: function() {
                return {
                    pre: function(scope, element, attrs) {
                        if (attrs.file == 'image') {
                            var url = Env.API_URL + '/upload/image';
                        } else {
                            var url = Env.API_URL + '/upload/docs';
                        }

                        scope.uploader = new FileUploader({
                            url: url,
                            autoUpload: true,
                            formData: [{
                                _token: Env.TOKEN
                            }],
                        });
                    },
                    // link
                    post: function(scope, element, attrs) {
                        var uploader = scope.uploader;
                        uploader.onSuccessItem = function(fileItem, response, status, headers) {

                            scope.$apply(function() {
                                scope.ngModel = response.url;
                            });

                            msgService.notif('Sukses', 'Proses upload file berhasil', 'info');
                        }

                        uploader.onCompleteAll = function() {
                            setTimeout((function() {
                                $('body').removeClass('app-loading');
                            }), 1000);
                        };

                        uploader.onProgressAll = function(progress) {
                            $('body').addClass('app-loading');
                            msgService.notif('Info', 'Proses upload file');
                        };

                        uploader.onErrorItem = function(fileItem, response, status, headers) {
                            setTimeout((function() {
                                $('body').removeClass('app-loading');
                            }), 1000);
                            msgService.modal(response.error.message, response.error.meta_message);
                        };

                        // /*{File|FileLikeObject}*/
                        /* uploader.onWhenAddingFileFailed = function(item , filter, options) {
                            console.info('onWhenAddingFileFailed', item, filter, options);
                        };
                        uploader.onAfterAddingFile = function(fileItem) {
                            console.info('onAfterAddingFile', fileItem);
                        };
                        uploader.onAfterAddingAll = function(addedFileItems) {
                            console.info('onAfterAddingAll', addedFileItems);
                        };
                        uploader.onBeforeUploadItem = function(item) {
                            console.info('onBeforeUploadItem', item);
                        };

                        uploader.onCancelItem = function(fileItem, response, status, headers) {
                            console.info('onCancelItem', fileItem, response, status, headers);
                        };
                        uploader.onCompleteItem = function(fileItem, response, status, headers) {
                            console.info('onCompleteItem', fileItem, response, status, headers);
                        };
                        uploader.onCompleteAll = function() {
                            console.info('onCompleteAll');
                        }; */

                        // console.log(2);
                        // console.log(scope.uploader);
                    }
                }
            }
        }
    }

})();