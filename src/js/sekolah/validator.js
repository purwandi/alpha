(function() {
    'use strict';

    angular
        .module('app.sekolah')
        .config(validator);

    /* @ngInject */
    function validator($validationProvider) {

        // Base on
        // http://rickharrison.github.io/validate.js/validate.js

        /*
         * Define the regular expressions that will be used
         */
        var ruleRegex = /^(.+?)\[(.+)\]$/,
            numericRegex = /^[0-9]+$/,
            integerRegex = /^\-?[0-9]+$/,
            decimalRegex = /^\-?[0-9]*\.?[0-9]+$/,
            emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
            alphaRegex = /^[a-z]+$/i,
            alphaNumericRegex = /^[a-z0-9]+$/i,
            alphaDashRegex = /^[a-z0-9_\-]+$/i,
            naturalRegex = /^[0-9]+$/i,
            naturalNoZeroRegex = /^[1-9][0-9]*$/i,
            ipRegex = /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i,
            base64Regex = /[^a-zA-Z0-9\/\+=]/i,
            numericDashRegex = /^[\d\-\s]+$/,
            urlRegex = /^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;
        
        $validationProvider
            .setExpression({
                digit: function(value, scope, element, attrs) {
                    var length = parseInt(attrs.length);
                    if (!numericRegex.test(length)) {
                        return false;
                    }

                    return value.length === parseInt(length, 10);
                },
                maxdigit: function(value, scope, element, attrs) {
                    var length = parseInt(attrs.length);
                    if (!numericRegex.test(length)) {
                        return false;
                    }

                    return value.length <= parseInt(length, 10)
                },
                mindigit: function(value, scope, element, attrs) {
                    var length = parseInt(attrs.length);
                    if (!numericRegex.test(length)) {
                        return false;
                    }

                    return value.length >= parseInt(length, 10)
                },
                alpha: function(value, scope, element, attrs) {
                    return (alphaRegex.test(value));
                },
                alphanumeric: function(value, scope, element, attrs) {
                    return (alphaNumericRegex.test(value));
                },
                alphadash: function(value, scope, element, attrs) {
                    return (alphaDashRegex.test(value));
                },
                integer: function(value, scope, element, attrs) {
                    return (integerRegex.test(value));
                },
                decimal: function(value, scope, element, attrs) {
                    return (decimalRegex.test(value));
                },
                isnatural: function(value, scope, element, attrs) {
                    return (naturalRegex.test(value));
                },
                isnaturalnozero: function(value, scope, element, attrs) {
                    return (naturalNoZeroRegex.test(value));
                },
                validip: function(value, scope, element, attrs) {
                    return (ipRegex.test(value));
                },
                validurl: function(value, scope, element, attrs) {
                    return (urlRegex.test(value));
                }
                
            })
            .setDefaultMsg({
                digit: {
                    error: 'Number should between 5 ~ 10',
                    success: 'good'
                },
                maxdigit: {
                    error: 'Number should between 5 ~ 10',
                    success: 'good'
                },
                mindigit: {
                    error: 'Number should between 5 ~ 10',
                    success: 'good'
                }
            });

    }

})();