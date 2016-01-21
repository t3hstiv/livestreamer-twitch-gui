define([
	"utils/node/progress",
	"utils/node/WritableMemoryStream",
	"utils/node/fs/stat",
	"utils/node/fs/mkdirp",
	"utils/node/http/getRedirected",
	"commonjs!url",
	"commonjs!path",
	"commonjs!fs"
], function(
	progress,
	WritableMemoryStream,
	stat,
	mkdirp,
	getRedirected,
	URL,
	PATH,
	FS
) {

	function downloadPromise( url, writeStream, progressCallback ) {
		return getRedirected( url ).then(function( incomingMessage ) {
			var defer = Promise.defer();

			writeStream.once( "error", defer.reject );

			incomingMessage.once( "error", defer.reject );
			incomingMessage.once( "end",   defer.resolve );

			incomingMessage.on( "unpipe", function() {
				defer.reject( new Error( "I/O error" ) );
			});

			// setup the progressCallback
			// it's fine to return NaN if the content-length header not available
			var size = Number( incomingMessage.headers[ "content-length" ] );
			progress( incomingMessage, size, progressCallback );

			// link readStream and writeStream
			incomingMessage.pipe( writeStream, { end: true } );

			// the completion promise
			var promise = defer.promise
				.then( function() {
					writeStream.end();
					return writeStream;
				}, function( err ) {
					// stop the download in case of any error
					incomingMessage.destroy();
					writeStream.end();
					return Promise.reject( err );
				});

			return {
				promise    : promise,
				readStream : incomingMessage,
				writeStream: writeStream,
				path       : writeStream.path
			};
		});
	}


	/**
	 * Download a file over http(s) and write it to the filesystem or memory
	 * @param {String} url
	 * @param {(String|Object|null)} dest
	 * @param {String?} dest.directory
	 * @param {String?} dest.name
	 * @param {Function?} progressCallback
	 * @returns {Promise}
	 */
	function download( url, dest, progressCallback ) {
		var parsedURL;
		try {
			parsedURL = URL.parse( url );
			if ( !parsedURL.protocol || !parsedURL.host ) {
				return Promise.reject( new Error( "Invalid download URL" ) );
			}
		} catch ( err ) {
			return Promise.reject( err );
		}

		// download into memory
		if ( dest === null ) {
			var stream = new WritableMemoryStream();

			return downloadPromise( parsedURL, stream, progressCallback );

		} else if ( typeof dest === "string" ) {
			dest = {
				dir : dest,
				name: null
			};
		}

		if ( !dest.dir || typeof dest.dir !== "string" ) {
			return Promise.reject( new Error( "Unknown directory" ) );
		}

		// does the path exist?
		return stat( dest.dir, stat.isDirectory )
			.catch(function() {
				// if not, try to create it
				return mkdirp( dest.dir );
			})
			.then(function() {
				// download and save
				var name   = dest.name || PATH.basename( parsedURL.pathname ) || "download";
				var path   = PATH.join( dest.dir, name );
				var stream = new FS.WriteStream( path );

				return downloadPromise( url, stream, progressCallback );
			});
	}


	return download;

});
