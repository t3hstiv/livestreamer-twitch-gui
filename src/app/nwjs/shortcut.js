import { App } from "nwjs/nwjs";
import { sort } from "utils/semver";
import resolvePath from "utils/resolvePath";
import metadata from "json!root/metadata";
import PATH from "commonjs!path";
import OS from "commonjs!os";


var config = metadata.package.config[ "notifications-toast-windows" ];

var vers = OS.release();
var win8 = config[ "version-min" ];


export function createShortcut( name ) {
	if (
		// check if current platform is windows
		   process.platform === "win32"
		// check if windows version is >= 8
		&& sort([ vers, win8 ]).shift() === win8
	) {
		// register AppUserModelID
		// this is required for toast notifications on windows 8+
		// https://github.com/nwjs/nwjs/wiki/Notification#windows
		var resolved = resolvePath( config[ "shortcut-path" ] );
		var filename = `${ name }.lnk`;
		var shortcut = PATH.join( resolved, filename );
		App.createShortcut( shortcut );
	}
}
