define(function() {

	function progress( incomingMessage, size, callback ) {
		if ( !( callback instanceof Function ) ) { return; }

		var completed = 0;

		incomingMessage.on( "data", function( chunk ) {
			completed += chunk.length;
			callback( completed, size, completed / size );
		});
	}


	return progress;

});
