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
		var defer = Promise.defer();

		function resolve() {
			writeStream.end();
			defer.resolve();
		}

		function reject( err ) {
			writeStream.end();
			defer.reject( err );
		}

		writeStream.once( "error", reject );

		// start the download
		getRedirected( url )
			.then(function( incomingMessage ) {
				// setup the progressCallback
				progress( incomingMessage, progressCallback );

				incomingMessage.pipe( writeStream, { end: true } );
				incomingMessage.once( "error", reject );
				incomingMessage.once( "end",   resolve );

				incomingMessage.on( "unpipe", function() {
					// stop download in case the writeStream was closed
					incomingMessage.destroy();
					reject( new Error( "I/O error" ) );
				});
			})
			.catch( reject );

		return defer.promise;
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

			return downloadPromise( parsedURL, stream, progressCallback ).then(function() {
				return stream;
			});

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

				return downloadPromise( url, stream, progressCallback ).then(function() {
					return path;
				});
			});
	}


	return download;

});
