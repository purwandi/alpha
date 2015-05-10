(function() {
	'use strict';

	angular
		.module('app.sekolah', [
			'ui.bootstrap',
			'ui.bootstrap.tpls',

			'validation',
			'validation.rule',
			'app.directive.datepicker',
            'monospaced.qrcode',
            'upload',

			'app.sekolah.repository'
		])

})();