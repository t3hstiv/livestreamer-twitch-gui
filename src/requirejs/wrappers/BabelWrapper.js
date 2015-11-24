define([
	"json!root/.babelrc",
	"commonjs!babel-core",
	"commonjs!babel-preset-es2015",
	"commonjs!babel-plugin-transform-es2015-modules-amd"
], function(
	config,
	BabelCore
) {

	var reName = /^[A-Z]/;
	var reAmd  = /^(?:\s*\/\/.*\n\s*|\s*\/\*.*\*\/\s*)*define\(/m;
	var reStrict = /^\s*('|")use strict\1;\s*/m;

	function resolveModuleSource( name ) {
		// ignore other plugins and ignore library modules (starting with a capitalized letter)
		// read everything else as an es6 module
		return name.indexOf( "!" ) !== -1 || reName.test( name )
			? name
			: "es6!" + name;
	}

	function transform( text, options ) {
		// check if a module is written in AMD
		if ( reAmd.test( text ) ) {
			return text;
		}

		// custom options
		options = options || {};
		Object.keys( config ).forEach(function( key ) {
			if ( options.hasOwnProperty( key ) ) { return; }
			options[ key ] = config[ key ];
		});

		options.ast = false;
		options.code = true;
		options.moduleIds = false;
		options.resolveModuleSource = resolveModuleSource;

		return BabelCore.transform( text, options )
			.code
			.replace( reStrict, "" );
	}


	return {
		transform: transform
	};

});
