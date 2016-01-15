define(function() {

	function progress( incomingMessage, callback ) {
		if ( !( callback instanceof Function ) ) { return; }

		// it's fine to return NaN if the content-length header not available
		var size = Number( incomingMessage.headers[ "content-length" ] );
		var completed = 0;

		incomingMessage.on( "data", function( chunk ) {
			completed += chunk.length;
			callback( completed, size, completed / size );
		});
	}


	return progress;

});
