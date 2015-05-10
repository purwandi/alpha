(function() {
    angular
        .module('app.directive.prodi', [])

        .directive('prodi', function() {
            return {
                restrict: 'E',
                tranclude: true,
                link: function(scope, element, attrs) {
                    var prodi = TAFFY(APP.PRODI);

                    var value = prodi({id : {is: parseInt(attrs.prodid)}}).first();
                    element.text(value.nama);
                }
            }
        })
})();