define([
	"Ember",
	"EmberData",
	"models/LivestreamerParameters",
	"utils/Parameter"
], function(
	Ember,
	DS,
	LivestreamerParameters,
	Parameter
) {

	var get = Ember.get;
	var set = Ember.set;
	var attr = DS.attr;
	var belongsTo = DS.belongsTo;
	var alias = Ember.computed.alias;


	/**
	 * @class Livestreamer
	 */
	return DS.Model.extend({
		stream      : belongsTo( "twitchStream", { async: false } ),
		channel     : belongsTo( "twitchChannel", { async: false } ),
		quality     : attr( "number" ),
		gui_openchat: attr( "boolean" ),
		started     : attr( "date" ),


		/** @property {ChildProcess} spawn */
		spawn  : null,
		success: false,
		error  : false,
		warning: false,
		log    : null,
		showLog: false,


		auth    : Ember.inject.service(),
		settings: Ember.inject.service(),

		session: alias( "auth.session" ),


		kill: function() {
			var spawn = get( this, "spawn" );
			if ( spawn ) {
				spawn.kill( "SIGTERM" );
			}
		},

		clearLog: function() {
			return set( this, "log", [] );
		},

		pushLog: function( type, line ) {
			get( this, "log" ).pushObject({
				type: type,
				line: line
			});
		},

		qualityObserver: function() {
			// The LivestreamerService knows that it has to spawn a new child process
			this.kill();
		}.observes( "quality" ),

		parameters: function() {
			return Parameter.getParameters(
				this,
				LivestreamerParameters,
				get( this, "settings.advanced" )
			);
		}.property().volatile()

	}).reopenClass({

		toString: function() { return "Livestreamer"; }

	});

});
