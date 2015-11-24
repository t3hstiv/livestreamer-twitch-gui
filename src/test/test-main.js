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

	require( [ "../app/config" ], function() {

		require([
			"QUnit",
			"EmberTest"
		], function( QUnit ) {

			QUnit.config.autostart = false;

			// then load tests and start QUnit
			// need to use window.startQUnit here
			require( [ "es6!./tests" ], window.startQUnit );

		});

	});

});
