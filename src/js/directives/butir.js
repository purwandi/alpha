(function() {
    angular
        .module('app.directive.butir', [])

        .directive('butir', function() {
            return {
                restrict: 'A',
                tranclude: true,
                template: '<div ng-model',
                compile: function(element, tAttrs) {
                
                    var linkFunction = function ($scope, element, attributes) {
                        element.html('<label><input type="radio" ng-click="getValue();" name="pilihan_'+attributes.nomor+'" value="'+attributes.nilai+'" ng-model="jawaban['+attributes.nomor+']">' + attributes.nama +'</label>');
                    }

                    return linkFunction;
                }
            }
        });
})();