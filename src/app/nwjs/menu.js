import nwGui from "nwjs/nwGui";
import nwWindow from "nwjs/nwWindow";


var macNativeMenuBar;


export function createMacNativeMenuBar( appname ) {
	if ( macNativeMenuBar ) { return; }
	macNativeMenuBar = new nwGui.Menu({ type: "menubar" });
	macNativeMenuBar.createMacBuiltin( appname, {
		hideEdit  : false,
		hideWindow: false
	});
	nwWindow.menu = macNativeMenuBar;
}
