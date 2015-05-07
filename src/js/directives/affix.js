(function() {
    angular
        .module('app.directive.affix', [])

        .directive('affix', function() {
            return {
                restrict: 'A',
                tranclude: true,
                link: function(scope, element, attributes) {
                    $('.affix').affix({
					  	offset: {
					    	top: 100,
					    	bottom: 20
					  	}
					});
                }
            }
        });
})();


