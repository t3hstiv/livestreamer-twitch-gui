import nwGui from "nwjs/nwGui";
import { some } from "utils/contains";


var { fullArgv } = nwGui.App;


export var tray = some.call( fullArgv, "--tray", "--hide", "--hidden" );
export var max  = some.call( fullArgv, "--max", "--maximize", "--maximized" );
export var min  = some.call( fullArgv, "--min", "--minimize", "--minimized" );
export var resetwindow = some.call( fullArgv, "--reset-window" );
export var versioncheck = !some.call( fullArgv, "--no-version-check" );
