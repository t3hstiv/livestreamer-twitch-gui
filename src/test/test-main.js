define(function( require ) {

	require( [ "../app/config" ], function() {

		require([
			"QUnit",
			"EmberTest"
		], function( QUnit ) {

			// then load tests and start QUnit
			require( [ "es6!./tests" ], QUnit.start );

		});

	});

});
