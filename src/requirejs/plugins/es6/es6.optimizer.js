define([
	"Babel",
	"requirejs/utils/fetch.optimizer"
], function(
	Babel,
	fetch
) {

	var buildMap = {};

	return {
		load: function( name, req, onload ) {
			var url = req.toUrl( name + ".js" );
			var code;

			fetch( url, function( text ) {
				try {
					code = Babel.transform( text, {
						sourceFileName: url
					});
					buildMap[ name ] = code;
				} catch ( e ) {
					return onload.error( e );
				}

				onload.fromText( code );
			}, onload.error );
		},

		write: function( pluginName, moduleName, write ) {
			if ( !buildMap.hasOwnProperty( moduleName ) ) { return; }

			write.asModule( pluginName + "!" + moduleName, buildMap[ moduleName ] );
		}
	};

});
