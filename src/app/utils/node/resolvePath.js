define([
	"utils/node/platform",
	"commonjs!path"
], function(
	platform,
	PATH
) {

	var reVarWindows = /%([^%]+)%/g;
	var reVarUnix    = /\$([A-Z_]+)/g;

	function fnVarReplace( _, v ) {
		return process.env[ v ];
	}

	function resolvePathWindows( path ) {
		path = path.replace( reVarWindows, fnVarReplace );
		return PATH.resolve( path );
	}

	function resolvePathUnix( path ) {
		path = path.replace( reVarUnix, fnVarReplace );
		return PATH.resolve( path );
	}


	return platform.isWin
		? resolvePathWindows
		: resolvePathUnix;

});
