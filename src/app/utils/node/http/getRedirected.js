define([
	"commonjs!http",
	"commonjs!https",
	"commonjs!url"
], function(
	HTTP,
	HTTPS,
	URL
) {

	var MAX = 3;

	var getHTTP  = HTTP.get;
	var getHTTPS = HTTPS.get;

	var parseURL  = URL.parse;
	var formatURL = URL.format;


	function mergeURLs( a, b ) {
		var parsedB = parseURL( a );
		// do nothing if second URL contains host
		if ( parsedB.host ) { return b; }

		// take first URL's protocol and host and apply it to the second one
		var parsedA = parseURL( a );

		parsedB.protocol = parsedA.protocol;
		parsedB.auth = parsedA.auth;
		parsedB.host = parsedA.host;

		return formatURL( parsedB );
	}

	function promiseRequest( url ) {
		var defer = Promise.defer();

		// detect protocol
		var get = parseURL( url ).protocol === "https:" ? getHTTPS : getHTTP;

		// send a GET request
		get( url, function( res ) {
			var status = res.statusCode;

			if ( status >= 300 && status < 400 ) {
				// redirection
				defer.reject( res.headers.location );

			} else if ( status !== 200 ) {
				// error
				defer.reject( new Error( "HTTP Error: " + status ) );

			} else {
				// success
				defer.resolve( res );
			}
		}).on( "error", defer.reject );

		return defer.promise;
	}

	function doRequest( url, num ) {
		return promiseRequest( url )
			.catch(function( data ) {
				if ( typeof data !== "string" ) {
					// error
					return Promise.reject( data );

				} else if ( !data.length ) {
					// redirect without location header
					return Promise.reject( new Error( "Missing location header" ) );

				} else if ( num > MAX ) {
					// too many redirects
					return Promise.reject( new Error( "Maximum number of redirects reached" ) );

				} else {
					// add current host to url if it's a relative one
					url = mergeURLs( url, data );
					// try again with new url
					return doRequest( url, ++num );
				}
			});
	}


	return function getRedirected( url ) {
		return doRequest( url, 1 );
	};

});
