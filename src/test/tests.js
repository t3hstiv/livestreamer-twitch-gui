(function() {
	var args = window.nwDispatcher.nwGui.App.fullArgv;
	var connectedAndLoaded = args.indexOf( "--runtests" ) !== -1;

	window.setupQUnit = window.setupQUnit || function() {};

	window.startQUnit = function() {
		var QUnit = window.QUnit;
		if ( QUnit && connectedAndLoaded ) {
			window.setupQUnit();
			QUnit.start.apply( QUnit, arguments );
		} else {
			connectedAndLoaded = true;
		}
	};
})();


define(function( require ) {

	// load requirejs app-config
	require( [ "/src/app/config.js" ], function() {

		// adjust paths to the test environment
		requirejs.config({
			"baseUrl": "/src/app",

			"shim": {
				"QUnit": {
					"exports": "QUnit"
				}
			},

			"paths": {
				// Test paths
				"test": "../../tests",

				// Vendor paths
				"QUnit": "../vendor/qunit/qunit/qunit"
			}
		});


		require( [ "QUnit" ], function( QUnit ) {
			QUnit.config.autostart = false;

			require( [ "text!../../tests.json" ], function( tests ) {
				tests = JSON.parse( tests ).tests;

				// then load tests and start QUnit
				require( tests, window.startQUnit );
			});
		});

	});

});
