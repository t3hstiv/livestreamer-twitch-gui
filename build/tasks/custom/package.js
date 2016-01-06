module.exports = function( grunt ) {
	"use strict";

	var pack = require( "../common/package" );

	grunt.task.registerMultiTask(
		"package",
		"Create a package",
		function() {
			switch ( this.target ) {
				case "chocolatey":
					var releaseNotes = pack.getReleaseNotes( grunt.package.version );
					grunt.config.set( "package.chocolatey.releaseNotes", releaseNotes );
					break;
			}

			grunt.task.run( this.data.tasks );
		}
	);

};
