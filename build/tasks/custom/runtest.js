module.exports = function( grunt ) {
	"use strict";

	var Q        = require( "q" ).Promise;
	var NWjs     = require( "../common/nwjs" );
	var criQUnit = require( "../common/criTestReporterQUnit" );
	var criWin   = require( "../common/criShowNWjsWindow" );

	var task  = "runtest";
	var descr = "Run the tests in NW.js";

	grunt.registerTask( task, descr, function() {
		var done    = this.async();
		var flags   = this.flags;
		var options = this.options({
			connTimeout : 5000,
			startTimeout: 5000,
			testTimeout : 60000,
			host        : "localhost",
			port        : 8000
		});

		var cri = flags.show || flags.visible
			? criWin
			: criQUnit;

		var argv = [ "--remote-debugging-port=" + options.port ];
		if ( flags.show === true || flags.visible === true ) {
			// don't wait for the CRI to start the test run
			argv.push( "--runtests" );
		}
		var nwjs = new NWjs( grunt, options.path, { "argv": argv } );

		function kill() {
			if ( nwjs.isAppRunning() ) {
				grunt.log.debug( "Killing the NW.js process..." );
				nwjs.getAppProcess().kill();
			}
		}

		function fail( err ) {
			kill();
			grunt.fail.fatal( err );
		}

		new Q(function( resolve, reject ) {
			// listen for the appstart event
			nwjs.on( "appstart", function() {
				grunt.log.debug( "NW.js started" );

				var process = nwjs.getAppProcess();
				process.on( "close", function() {
					reject( "NW.js process terminated early" );
				});

				// add a slight delay of one second
				// so we can "make sure" that we're able to connect to NW.js via CRI
				setTimeout(function() {
					// connect
					cri( grunt, flags, options )
						// resolve on a successful test run
						.then( resolve, reject );
				}, 1000 );
			});

			grunt.log.debug( "Starting NW.js..." );

			// start the NW.js process (or download NW.js first)
			nwjs.run()
				// reject in both cases
				.then( reject, reject );
		})
			// make sure to terminate the NW.js process
			.then(function( noShutdown ) {
				if ( noShutdown !== true ) {
					kill();
				}
			})
			.then( done, fail );
	});
};
