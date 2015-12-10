import {
	get,
	set,
	computed,
	run
} from "Ember";
import ListItemComponent from "components/ListItemComponent";
import layout from "hbs!templates/components/StreamItemComponent";


var { alias, and, bool } = computed;
var { cancel, later } = run;


export default ListItemComponent.extend({
	layout,
	classNameBindings: [
		":stream-item-component",
		"_showGame:show-game",
		"showFlag:show-flag",
		"faded:faded",
		"expanded:expanded"
	],

	action: "openLivestreamer",
	openBrowser: "openBrowser",

	channel: alias( "content.channel" ),

	expanded: false,
	locked  : false,
	timer: null,

	showGame: false,
	_showGame: and( "showGame", "channel.game" ),

	showFlag: bool( "settings.gui_flagsvisible" ),

	faded: function() {
		if ( get( this, "settings.gui_filterstreams" ) ) {
			return false;
		}

		var filter = get( this, "settings.gui_langfilter" );
		var clang  = get( this, "channel.language" );
		var blang  = get( this, "channel.broadcaster_language" );

		// a channel language needs to be set
		return clang
			&& (
				// fade out if
				// no broadcaster language is set and channel language is filtered out
				   !blang && filter[ clang ] === false
				// OR broadcaster language is set and filtered out (ignore channel language)
				||  blang && filter[ blang ] === false
				// OR broadcaster language is set to "other" and a filter has been set
				||  blang === "other" && get( this, "hasCustomLangFilter" )
			);
	}.property(
		"settings.gui_langfilter",
		"content.channel.language",
		"content.channel.broadcaster_language"
	),

	/**
	 * @returns {boolean} return false if none or all languages are selected
	 */
	hasCustomLangFilter: function() {
		var filters = get( this, "settings.gui_langfilter" );
		var keys    = Object.keys( filters );
		var current = filters[ keys.shift() ];
		return keys.reduce(function( result, value ) {
			if ( !result ) {
				value   = filters[ value ];
				result  = current !== value;
				current = value;
			}
			return result;
		}, false );
	}.property( "settings.gui_langfilter" ),


	mouseLeave: function() {
		var expanded = get( this, "expanded" );
		var locked   = get( this, "locked" );
		if ( !expanded || locked ) { return; }

		this.clearTimer();

		this.timer = later( this, function() {
			if ( get( this, "locked" ) ) { return; }
			set( this, "expanded", false );
		}, 1000 );
	},

	clearTimer: function() {
		if ( this.timer ) {
			cancel( this.timer );
			this.timer = null;
		}
	}.on( "willDestroyElement", "mouseEnter" ),


	actions: {
		"startStream": function() {
			if ( get( this, "expanded" ) ) {
				if ( get( this, "locked" ) ) { return; }
				this.clearTimer();
				set( this, "expanded", false );
			} else {
				this.sendAction( "action", get( this, "content" ) );
			}
		},

		"details": function() {
			if ( get( this, "expanded" ) ) {
				this.toggleProperty( "locked" );
			} else {
				set( this, "expanded", true );
			}
		},

		"openBrowser": function( url ) {
			this.sendAction( "openBrowser", url );
		}
	}
});
