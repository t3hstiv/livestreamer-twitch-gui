define([
	"commonjs!util",
	"commonjs!buffer",
	"commonjs!stream"
], function(
	UTIL,
	BUFFER,
	STREAM
) {

	var Buffer   = BUFFER.Buffer;
	var Writable = STREAM.Writable;


	/**
	 * @class WritableMemoryStream
	 * @augments Stream.Writable
	 * @constructor
	 */
	function WritableMemoryStream() {
		Writable.call( this );
		this.buffer = new Buffer( 0 );
	}

	UTIL.inherits( WritableMemoryStream, Writable );

	WritableMemoryStream.prototype._write = function( chunk, encoding, callback ) {
		if ( !Buffer.isBuffer( chunk ) ) {
			chunk = new Buffer( chunk, encoding );
		}

		this.buffer = Buffer.concat([ this.buffer, chunk ]);
		callback();
	};

	WritableMemoryStream.prototype.toString = function() {
		return this.buffer.toString();
	};


	return WritableMemoryStream;

});
