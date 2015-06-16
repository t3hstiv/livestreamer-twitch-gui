"use strict";

var Q   = require( "q" ).Promise;
var CRI = require( "chrome-remote-interface" );


/**
 * @returns {Promise}
 */
module.exports = function( grunt, flags, options ) {
	function connect() {
		return new Q(function( resolve, reject ) {
			var cri = CRI({
				host: options.host,
				port: options.port
			});

			var wait = setTimeout(function() {
				reject( "Chrome Remote Interface connection timeout" );
			}, options.connTimeout );

			cri.on( "error", reject );
			cri.on( "connect", function( chrome ) {
				if ( wait ) { clearTimeout( wait ); }

				chrome.Console.enable();
				chrome.Runtime.enable();

				grunt.log.debug( "Connected to " + options.host + ":" + options.port );

				resolve( chrome );
			});
		});
	}

	// try to connect 3 times in a row before failing
	var promise = connect();
	for ( var i = 1, n = 3; i < n; i++ ) {
		/* jshint loopfunc:true */
		promise = promise.catch(function() {
			return new Q(function( resolve ) {
				setTimeout( resolve, 1000 );
			})
				.then( connect );
		});
	}

	return promise;
};
