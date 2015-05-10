(function() {
  angular
    .module('app.directive.datepicker', [])
    .directive('datePicker', function() {
      return {
        restrict: 'E',
        link: function(scope, element, attrs) {
          $(element).DateTimePicker();
        }
      }
    })
  })();