import {
	get,
	computed,
	inject,
	Controller
} from "Ember";


var { alias } = computed;
var { service } = inject;


export default Controller.extend({
	metadata: service(),

	stream : alias( "model.stream" ),
	channel: alias( "model.channel" ),
	panels : alias( "model.panels" ),

	age: function() {
		var createdAt = get( this, "channel.created_at" );
		return ( new Date() - createdAt ) / ( 24 * 3600 * 1000 );
	}.property( "channel.created_at" ),

	language: function() {
		var codes = get( this, "metadata.config.language_codes" );
		var blang = get( this, "channel.broadcaster_language" );
		var lang  = codes[ blang ];
		return lang ? lang[ "lang" ] : "";
	}.property( "channel.broadcaster_language" ),


	actions: {
		"startStream": function( stream ) {
			if ( !stream ) { return; }
			this.send( "openLivestreamer", stream );
		}
	}
});
