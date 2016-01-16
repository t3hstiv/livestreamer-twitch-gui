define(function() {

	var timeMax = 5000;


	function progress( stream, overall, callback ) {
		if ( !( callback instanceof Function ) ) { return; }

		var completed = 0;
		var started   = +new Date();

		// list of chunk sizes and timestamps, oldest one at the beginning
		var history = [];
		// sum of all current history item sizes
		var histSum = 0;

		stream.on( "data", function( chunk ) {
			var now    = +new Date();
			var time   = now - timeMax;
			var length = chunk.length;

			// remove items older than the maximum time
			for ( var item, i = 0, l = history.length; i < l; i++ ) {
				item = history[ i ];
				if ( item.time >= time ) { break; }
				// subtract from history sum
				histSum -= item.length;
			}
			// remove old items
			history.splice( 0, i );

			// add length
			completed += length;
			histSum   += length;
			// add new history item
			history.push({ time: now, length: length });

			var percent = completed / overall;
			var speed   = history.length === 1
				? 0
				: histSum / ( now - history[0].time );

			callback(
				completed,
				overall,
				// percentage
				percent,
				// speed in bytes per second
				speed * 1000,
				// time remaining in milliseconds
				( now - started ) * ( ( 1 - percent ) / percent )
			);
		});

		stream.once( "close", function() {
			history = null;
		});
	}


	return progress;

});
