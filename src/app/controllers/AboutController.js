import {
	get,
	inject,
	Controller
} from "Ember";


var { service } = inject;


export default Controller.extend({
	metadata: service(),

	dependencies: function() {
		var deps = get( this, "metadata.dependencies" );
		return Object.keys( deps ).map(function( key ) {
			return {
				title  : key,
				version: deps[ key ]
			};
		});
	}.property( "metadata.dependencies" )
});
