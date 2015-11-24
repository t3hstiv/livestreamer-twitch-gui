define([
	"requirejs/utils/fetch.dev"
], function(
	fetch
) {

	var parse = JSON.parse;
	var reExt = /\.\w+$/;

	return {
		load: function( name, req, onload ) {
			var url = req.toUrl( name + ( !reExt.test( name ) ? ".json" : "" ) );

			fetch( url, function( response ) {
				var parsed = parse( response );
				onload( parsed );
			}, onload.error );
		}
	};

});
