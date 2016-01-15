define([
	"utils/node/fs/stat",
	"utils/node/progress",
	"commonjs!fs",
	"commonjs!crypto"
], function(
	stat,
	progress,
	FS,
	CRYPTO
) {

	/**
	 * Read file contents and compare checksum
	 * @param {string}    file
	 * @param {string}    expected
	 * @param {string?}   type
	 * @param {Function?} progressCallback
	 * @returns {Promise}
	 */
	function checksum( file, expected, type, progressCallback ) {
		// default hash type (shift arguments)
		if ( typeof type !== "string" ) {
			//noinspection JSValidateTypes
			progressCallback = type;
			// sufficient for integrity check
			type = "md5";
		}

		var hash = CRYPTO.createHash( type );

		return stat( file, stat.isFile, true )
			.then(function( data ) {
				var defer = Promise.defer();

				var stream = new FS.ReadStream( file );
				stream.once( "error", defer.reject );
				stream.once( "end", function() {
					var checksum = hash.digest( "hex" );

					if ( checksum === expected ) {
						defer.resolve( checksum );
					} else {
						defer.reject( new Error( "Checksum mismatch" ) );
					}
				});

				stream.on( "data", function( chunk ) {
					hash.update( chunk );
				});

				progress( stream, data.size, progressCallback );

				return defer.promise;
			});
	}


	return checksum;

});
