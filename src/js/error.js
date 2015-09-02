( function() {

    'use strict';

    angular
        .module('alert', [
            'ui.bootstrap.modal',
            'template/modal/backdrop.html',
            'template/modal/window.html',
        ])
        .factory('msgService', msgService);


    function msgService($modal) {

        var modal;
        var compileMessages = compileMessages;
        var openModal = openModal;

        return {
            modal: openModal,
            confirm: openConfirmModal,
            notif: openNotif
        }

        function compileMessages(messages) {
            var msg = TAFFY();

            for (var index in messages) {
                msg.insert({
                    'key': index,
                    'value': messages[index][0]
                });
            }

            return msg().get();
        }

        function openConfirmModal() {
            modal = $modal.open({
                backdrop: 'static',
                templateUrl: '/templates/modal-confirm-content.html',
                /* @ngInject */
                controller: function($scope) {
                    $scope.close = function() {
                        modal.close();
                    }

                    $scope.ok = function() {}
                }
            });
        }

        function openModal(title, messages, type) {
            modal = $modal.open({
                backdrop: 'static',
                templateUrl: '/templates/modal-error-content.html',
                /* @ngInject */
                controller: function($scope) {
                    $scope.title = title;
                    $scope.type = type;
                    $scope.messages = compileMessages(messages);
                    $scope.close = function() {
                        modal.close();
                    }
                }
            })
        }

        function openNotif(title, message, type, dup) {
            var _template;
            var _title;

            if (type === 'danger') {
                _template = '<div class="notify alert alert-danger animated slideInRight">';
            //_title = 'Oh snap! You got an error!';
            } else if (type === 'success') {
                _template = '<div class="notify alert alert-success animated slideInRight">';
            //_title = 'Great, you have successful!';
            } else if (type === 'info') {
                _template = '<div class="notify alert alert-info animated slideInRight">';
            //_title = 'Great, you have successful!';
            } else {
                _template = '<div class="notify alert alert-warning animated slideInRight">';
                //_title = 'Oh snap! You got an error!';
            }

            _template += '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';
            _template += '<strong>' + title + '</strong>';
            // _template += '<hr class="message-inner-separator">';
            _template += '<div class="notify-content">';
            _template += message;
            _template += '</div>';
            _template += '</div>';

            if (dup) {
                $('.message-bar').append(_template);
            } else {
                $('.message-bar').html(_template);
            }


            // $('.message-bar').prepend(_template);

            return setTimeout((function() {
                $('.message-bar .alert').last().remove();
            }), 4000);
        }
    }

} )();