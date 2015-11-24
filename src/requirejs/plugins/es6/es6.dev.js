define([
	"Babel",
	"requirejs/utils/fetch.dev"
], function(
	Babel,
	fetch
) {

	return {
		load: function( name, req, onload ) {
			var url = req.toUrl( name + ".js" );
			var code;

			fetch( url, function( text ) {
				try {
					code = Babel.transform( text, {
						sourceFileName: url,
						sourceMaps: "inline"
					});
				} catch ( e ) {
					return onload.error( e );
				}

				onload.fromText( code );
			}, onload.error );
		}
	};

});
