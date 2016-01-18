define( [ "Ember" ], function( Ember ) {

	var floor = Math.floor;

	var units = [ "TiB", "GiB", "MiB", "KiB", "Bytes" ]
		.map(function( item, index, array ) {
			return {
				prefix: item,
				size  : Math.pow( 2, 10 * ( array.length - index - 1 ) )
			};
		});


	return Ember.Helper.extend({
		compute: function( params ) {
			var size = Number( params[0] );
			if ( !params[0] || isNaN( size ) || size < 0 || size === Infinity ) { return "?"; }
			if ( size === 0 ) { return "0 Bytes"; }

			var obj = units.find(function( item ) {
				return size >= item.size;
			});

			var val = size / obj.size;
			var str = val >= 1000 || obj.prefix === "Bytes"
				// don't add decimals to values >= 1000 or simple bytes
				? floor( val ).toString()
				// prevent rounding of getFixed()
				: ( floor( val * 10 ) / 10 ).toFixed( 1 );

			return str + " " + obj.prefix;

		}

	}).reopenClass({
		units: units
	});

});
