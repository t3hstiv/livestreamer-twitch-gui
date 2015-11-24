"use strict";

var Q   = require( "q" );
var cri = require( "./cri" );


module.exports = function( grunt, flags, options ) {
	var connect = cri( grunt, flags, options );

	return connect.then(function( chrome ) {
		var defer = Q.defer();
		var wait  = setTimeout( defer.reject, 1000 );

		chrome.Runtime.evaluate({
			expression: "window.nwDispatcher.nwGui.Window.get().show()"
		}, function() {
			clearTimeout( wait );
			defer.resolve( true );
		});

		return defer.promise;
	});
};
