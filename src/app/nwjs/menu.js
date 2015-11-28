import {
	Menu,
	mainWindow
} from "nwjs/nwjs";


var macNativeMenuBar;


export function createMacNativeMenuBar( appname ) {
	if ( macNativeMenuBar ) { return; }
	macNativeMenuBar = new Menu({ type: "menubar" });
	macNativeMenuBar.createMacBuiltin( appname, {
		hideEdit  : false,
		hideWindow: false
	});
	mainWindow.menu = macNativeMenuBar;
}
