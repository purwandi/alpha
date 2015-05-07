(function() {
    angular
        .module('app.directive.maxheight', [])

        .directive('maxHeight', function() {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    //var winHeight = $(window).innerHeight();
                    //element.css('height', winHeight);

                    function setHeight() {
                        var windowHeight = $(window).innerHeight();
                        element.css('height', windowHeight);
                    };
                    
                    setHeight();

                    $(window).resize(function() {
                        setHeight();
                    });
                }
            }
        })
})();