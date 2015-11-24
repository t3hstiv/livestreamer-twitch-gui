define([
	"requirejs/utils/fetch.optimizer",
	"requirejs/utils/write"
], function(
	fetch,
	write
) {

	var parse     = JSON.parse;
	var stringify = JSON.stringify;
	var reExt     = /\.\w+$/;
	var buildMap  = {};

	return {
		load: function( name, req, onload ) {
			var url = req.toUrl( name + ( !reExt.test( name ) ? ".json" : "" ) );

			fetch( url, function( text ) {
				var parsed = parse( text );
				buildMap[ name ] = stringify( parsed );
				onload( parsed );
			}, onload.error );
		},

		write: write.bind( null, buildMap )
	};

});
