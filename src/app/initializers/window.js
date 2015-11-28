/* jshint latedef: false */

import {
	get,
	setProperties,
	run,
	Application
} from "Ember";
import {
	App,
	Screen,
	mainWindow
} from "nwjs/nwjs";
import {
	resetwindow as argvResetwindow
} from "nwjs/argv";
import { isWin } from "utils/platform";


var { debounce } = run;
var { manifest } = App;

var concat = [].concat;

var timeEvent  = 1000;
var timeIgnore = 2000;
var ignore     = false;


function deferEvent( thisArg, fn ) {
	var args = [ thisArg, fn ];
	return function() {
		// Ember.run.debounce( thisArg, fn, arguments..., time );
		debounce.apply( null, concat.apply( args, arguments ).concat( timeEvent ) );
	};
}

function save( params ) {
	setProperties( this, params );
	this.save();
}

function onResize( width, height ) {
	if ( ignore ) { return; }
	// validate window position
	if ( !isWindowFullyVisible() ) { return; }
	save.call( this, { width, height } );
}

function onMove( x, y ) {
	if ( ignore ) { return; }
	// double check: NW.js moves the window to
	// [    -8,    -8] when maximizing...
	// [-32000,-32000] when minimizing...
	if ( isWin && ( x === -8 && y === -8 || x === -32000 && x === -32000 ) ) { return; }
	// validate window position
	if ( !isWindowFullyVisible() ) { return; }
	save.call( this, { x, y } );
}

function ignoreNextEvent() {
	ignore = true;
	debounce( unignoreNextEvent, timeIgnore );
}

function unignoreNextEvent() {
	ignore = false;
}


function restoreWindow() {
	var width  = get( this, "width" );
	var height = get( this, "height" );
	if ( width !== null && height !== null ) {
		mainWindow.resizeTo( width, height );
	}

	var x = get( this, "x" );
	var y = get( this, "y" );
	if ( x !== null && y !== null ) {
		mainWindow.moveTo( x, y );
	}
}

function resetWindow() {
	save.call( this, {
		width : null,
		height: null,
		x     : null,
		y     : null
	});
}


function resetWindowPosition() {
	// use the DE's main screen and the minimum window size
	var screen = Screen.screens[0].bounds;
	var { width: w, height: h } = manifest.window;

	// center the window and don't forget the screen offset
	mainWindow.width  = w;
	mainWindow.height = h;
	mainWindow.x = Math.round( screen.x + ( screen.width  - w ) / 2 );
	mainWindow.y = Math.round( screen.y + ( screen.height - h ) / 2 );
	// also reset the saved window position
	resetWindow.call( this );
}

function onDisplayBoundsChanged() {
	// validate window position and reset if it's invalid
	if ( !isWindowFullyVisible() ) {
		resetWindowPosition.call( this );
	}
}

function isWindowFullyVisible() {
	var { x, y, width: w, height: h } = mainWindow;

	// the window needs to be fully visible on one screen
	return Screen.screens.some(function( screenObj ) {
		var bounds = screenObj.bounds;
		// substract screen offset from window position
		var posX = x - bounds.x;
		var posY = y - bounds.y;
		// check boundaries
		return posX >= 0
			&& posY >= 0
			&& posX + w <= bounds.width
			&& posY + h <= bounds.height;
	});
}


Application.instanceInitializer({
	name: "window",
	after: [ "ember-data", "nwjs" ],

	initialize: function( application ) {
		var store = application.lookup( "service:store" );

		store.findAll( "window" )
			.then(function( records ) {
				return records.content.length
					? records.objectAt( 0 )
					: store.createRecord( "window", { id: 1 } ).save();
			})
			.then(function( record ) {
				// reset window
				if ( argvResetwindow ) {
					resetWindow.call( record );
				} else {
					restoreWindow.call( record );
					// validate restored window position and reset if it's invalid
					if ( !isWindowFullyVisible() ) {
						resetWindowPosition.call( record );
					}
				}

				// listen for screen changes
				Screen.on( "displayBoundsChanged", onDisplayBoundsChanged.bind( record ) );

				// also listen for the maximize events
				// we don't want to save the window size+pos after these events
				mainWindow.on(   "maximize", ignoreNextEvent );
				mainWindow.on( "unmaximize", ignoreNextEvent );
				mainWindow.on(   "minimize", ignoreNextEvent );
				mainWindow.on(    "restore", ignoreNextEvent );

				// resize and move events need to be defered
				// the maximize events are triggered afterwards
				mainWindow.on( "resize", deferEvent( record, onResize ) );
				mainWindow.on(   "move", deferEvent( record, onMove   ) );
			});
	}
});
