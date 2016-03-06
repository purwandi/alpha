( function() {
    'use strict';

    angular
        .module('upload', ['angularFileUpload', 'alert'])
        .directive('uploadFile', uploadFile)
        .directive('uploadCanvas', uploadCanvas);

    function uploadCanvas() {
        return {
            restrict: 'A',
            scope: {
                ngModel: '='
            },
            template: '<div class="image-editor">' +
                '<input type="file" class="cropit-image-input">' +
                '<!-- .cropit-image-preview-container is needed for background image to work -->' +
                '<div class="cropit-image-preview-container">' +
                '<div class="cropit-image-preview"></div>' +
                '</div>' +
                '<div class="image-size-label">Resize image</div>' +
                '<input type="range" class="cropit-image-zoom-input">' +
                '<button class="export btn btn-default" ng-click="export()">Export</button>' +
                '</div>',
            link: function(scope, element, attr) {
                $(element).cropit({
                    exportZoom: 1.25,
                    imageBackground: true,
                    imageBackgroundBorderWidth: 20,
                    // imageState: {
                    //    src: 'http://lorempixel.com/500/400/',
                    //},
                });

                scope.export = function() {
                    var imageData = $(element).cropit('export');
                    scope.ngModel = imageData;
                    console.log('Load  data');
                }
            }
        }
    }

    /* @ngInject */
    function uploadFile(FileUploader, msgService) {
        return {
            restrict: 'E',
            scope: {
                ngModel: '='
            },
            template: '<input type="file" nv-file-select uploader="uploader" />' +
                '<input type="hidden" ng-model="ngModel">',
            compile: function() {
                return {
                    pre: function(scope, element, attrs) {
                        if (attrs.file == 'image') {
                            var url = Env.API_URL + '/upload/image';
                        } else if (attrs.file == 'doc') {
                            var url = Env.API_URL + '/upload/doc';
                        } else {
                            var url = Env.API_URL + '/upload/docs';
                        }

                        $('#upload-proses').hide();

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

                            setTimeout((function() {
                                $('#upload-proses').hide();
                            }), 2000);
                            msgService.notif('Sukses', 'Proses upload file berhasil', 'info');
                        }

                        uploader.onCompleteAll = function() {
                            setTimeout((function() {
                                $('body').removeClass('app-loading');
                            }), 1000);
                        };

                        uploader.onBeforeUploadItem = function(item) {
                            $('body').addClass('app-loading');
                            $('#upload-proses').show();
                            msgService.notif('Info', 'Proses upload file');
                        };

                        uploader.onProgressAll = function(progress) {};

                        uploader.onErrorItem = function(fileItem, response, status, headers) {
                            setTimeout((function() {
                                $('body').removeClass('app-loading');
                            }), 1000);
                            msgService.modal(response.error.message, response.error.meta_message);
                        };

                        //uploader.onWhenAddingFileFailed = function(item , filter, options) {
                        //    $('#upload-proses').show();
                        //};

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

} )();