import {
	get,
	computed
} from "Ember";
import {
	attr,
	Model
} from "EmberData";


var time = 60;

function nocache( attr ) {
	// use a volatile property
	return computed( attr, function() {
		var url = get( this, attr );
		// use the same timestamp for `time` seconds
		var timestamp = +new Date() / 1000;
		timestamp -= timestamp % time;

		return `${ url }?_=${ timestamp }`;
	}).volatile();
}


export default Model.extend({
	large   : attr( "string" ),
	medium  : attr( "string" ),
	small   : attr( "string" ),
	template: attr( "string" ),

	large_nocache : nocache( "large" ),
	medium_nocache: nocache( "medium" ),
	small_nocache : nocache( "small" )
});
