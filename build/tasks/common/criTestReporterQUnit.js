"use strict";

var Q   = require( "q" );
var cri = require( "./cri" );


/*
 * This function will be executed by NW.js over the remote connection
 * based on grunt-contrib-qunit's phantomJS bridge implementation
 */
function QUnitSetup() {
	var QUnit = window.QUnit;
	if ( !QUnit ) {
		throw new Error( "QUnit not initialized" );
	}

	function sendMessage() {
		console.log.apply( console, arguments );
	}

	QUnit.log(function( obj ) {
		var actual, expected;
		if ( !obj.result ) {
			actual   = QUnit.dump.parse( obj.actual );
			expected = QUnit.dump.parse( obj.expected );
		}
		sendMessage( "qunit.log", obj.result, actual, expected, obj.message, obj.source );
	});

	QUnit.testStart(function( obj ) {
		sendMessage( "qunit.testStart", obj.name );
	});

	QUnit.testDone(function( obj ) {
		sendMessage( "qunit.testDone", obj.name, obj.failed, obj.passed, obj.total, obj.duration );
	});

	QUnit.moduleStart(function( obj ) {
		sendMessage( "qunit.moduleStart", obj.name );
	});

	QUnit.moduleDone(function( obj ) {
		sendMessage( "qunit.moduleDone", obj.name, obj.failed, obj.passed, obj.total );
	});

	QUnit.begin(function() {
		sendMessage( "qunit.begin" );
	});

	QUnit.done(function( obj ) {
		sendMessage( "qunit.done", obj.failed, obj.passed, obj.total, obj.runtime );
	});
}


/**
 * @returns {Promise}
 */
module.exports = function( grunt, flags, options ) {
	var connect = cri( grunt, flags, options );

	return connect.then(function( chrome ) {
		var defer = Q.defer();

		var started = false;

		// wait X seconds for QUnit to start or reject the promise
		var startTimeout = setTimeout(function() {
			defer.reject( "Timeout: Missing QUnit.start() call" );
		}, options.startTimeout );
		// wait X seconds for all tests to finish
		var testTimeout;

		// listen for qunit message
		chrome.on( "Console.messageAdded", function( message ) {
			var params = message.message.parameters;
			if ( !params || params.length < 1 ) { return; }

			grunt.log.debug( params.map(function( param ) { return param.value; }) );

			switch ( params[ 0 ].value ) {
				case "qunit.start":
					if ( params.length !== 1 ) { return; }
					if ( started === true ) { return; }
					started = true;

					if ( startTimeout ) {
						clearTimeout( startTimeout );
					}

					testTimeout = setTimeout(function() {
						defer.reject( "Timeout: The tests did not finish..." );
					}, options.testTimeout );
					break;

				case "qunit.done":
					if ( params.length !== 5 ) { return; }

					var status = {
						failed  : Number( params[ 1 ].value ),
						passed  : Number( params[ 2 ].value ),
						total   : Number( params[ 3 ].value ),
						duration: Number( params[ 4 ].value )
					};

					// resolve or reject the promise
					( status.failed === 0 && status.passed === status.total
						? defer.resolve
						: defer.reject
					)( status );
					break;
			}
		});

		// setup QUnit
		chrome.Runtime.evaluate({
			expression: "window.setupQUnit=" + QUnitSetup.toString()
		}, function() {
			grunt.log.debug( "QUnit test reporter set up" );

			// start QUnit
			chrome.Runtime.evaluate({
				expression: "window.startQUnit?window.startQUnit():window.QUnit.start()"
			}, function() {
				grunt.log.debug( "QUnit started" );
			});
		});

		return defer.promise;
	})
		// output
		.then(function( status ) {
			if ( status.total === 0 ) {
				grunt.log.warn( "0/0 assertions ran (" + status.duration + "ms)" );
			} else if ( status.total > 0 ) {
				grunt.log.ok( status.total + " assertions passed (" + status.duration + "ms)" );
			}
			return Q.Promise.resolve();

		}, function( status ) {
			if ( status.failed > 0 ) {
				grunt.log.warn( status.failed + "/" + status.total +
					" assertions failed (" + status.duration + "ms)" );
				return Q.Promise.reject();
			}
			return Q.Promise.reject( status );
		});
};
