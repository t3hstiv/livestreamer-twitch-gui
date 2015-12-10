import {
	get,
	addObserver,
	Application
} from "Ember";
import {
	mainWindow,
	Screen
} from "nwjs/nwjs";
import tray from "nwjs/tray";
import { createShortcut } from "nwjs/shortcut";
import { createMacNativeMenuBar } from "nwjs/menu";
import {
	tray as argvTray,
	max as argvMax,
	min as argvMin
} from "nwjs/argv";
import { isDarwin } from "utils/platform";


window.addEventListener( "beforeunload", function() {
	// remove all listeners
	mainWindow.removeAllListeners();
	Screen.removeAllListeners();
	process.removeAllListeners();
	// prevent tray icons from stacking up when refreshing the page or devtools
	tray.remove();
}, false );


var isHidden    = true;
var isMaximized = false;
var isMinimized = false;

mainWindow.on( "maximize",   function onMaximize()   { isMaximized = true;  } );
mainWindow.on( "unmaximize", function onUnmaximize() { isMaximized = false; } );
mainWindow.on( "minimize",   function onMinimize()   { isMinimized = true;  } );
mainWindow.on( "restore",    function onRestore()    { isMinimized = false; } );


mainWindow.on( "ready", function onReady( settings ) {
	// taskbar and tray OS integrations
	function onIntegrationChange() {
		var taskbar = get( settings, "isVisibleInTaskbar" );
		var tray    = get( settings, "isVisibleInTray" );
		mainWindow.setShowInTaskbar( taskbar );
		mainWindow.setShowInTray( tray, taskbar );
	}
	// observe the settings record
	addObserver( settings, "gui_integration", onIntegrationChange );
	onIntegrationChange();


	// hide in tray
	if ( argvTray ) {
		mainWindow.setShowInTray( true, get( settings, "isVisibleInTaskbar" ) );
		// remove the tray icon after clicking it if it's disabled in the settings
		if ( !get( settings, "isVisibleInTray" ) ) {
			tray.tray.once( "click", tray.remove.bind( tray ) );
		}
	} else {
		mainWindow.toggleVisibility( true );
	}

	// maximize window
	if ( argvMax ) {
		mainWindow.toggleMaximize( false );
	}
	// minimize window
	if ( argvMin ) {
		mainWindow.toggleMinimize( false );
	}

	if ( DEBUG ) {
		window.initialized = true;
	}
});


mainWindow.toggleMaximize = function toggleMaximize( bool ) {
	if ( bool === undefined ) { bool = isMaximized; }
	mainWindow[ bool ? "unmaximize" : "maximize" ]();
};

mainWindow.toggleMinimize = function toggleMinimize( bool ) {
	if ( bool === undefined ) { bool = isMinimized; }
	mainWindow[ bool ? "restore" : "minimize" ]();
};

mainWindow.toggleVisibility = function toggleVisibility( bool ) {
	if ( bool === undefined ) { bool = isHidden; }
	mainWindow[ bool ? "show" : "hide" ]();
	isHidden = !bool;
};


mainWindow.setShowInTray = function setShowInTray( bool, taskbar ) {
	// always remove the tray icon...
	// we need a new click event listener in case the taskbar param has changed
	tray.remove();
	if ( bool ) {
		tray.add(function() {
			mainWindow.toggleVisibility();
			// also toggle taskbar visiblity on click (gui_integration === both)
			if ( taskbar ) {
				mainWindow.setShowInTaskbar( !isHidden );
			}
		});
	}
};


Application.instanceInitializer({
	name: "nwjs",

	initialize: function( application ) {
		var metadata = application.lookup( "service:metadata" );

		var displayName    = get( metadata, "config.display-name" );
		var trayIconImg    = get( metadata, "config.tray-icon" );
		var trayIconImgOSX = get( metadata, "config.tray-icon-osx" );

		createShortcut( displayName );
		tray.init( displayName, trayIconImg, trayIconImgOSX );
		if ( isDarwin ) {
			createMacNativeMenuBar( displayName );
		}


		// listen for the close event and show the dialog instead of strictly shutting down
		mainWindow.on( "close", function() {
			if ( location.pathname !== "/index.html" ) {
				return mainWindow.close( true );
			}

			try {
				mainWindow.show();
				mainWindow.focus();
				application.lookup( "controller:application" ).send( "winClose" );
			} catch ( e ) {
				mainWindow.close( true );
			}
		});
	}
});
