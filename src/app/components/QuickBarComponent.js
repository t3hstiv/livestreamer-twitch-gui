import {
	get,
	set,
	run,
	Component
} from "Ember";
import layout from "hbs!templates/components/QuickBarComponent";


var { cancel, later } = run;


export default Component.extend({
	layout: layout,
	tagName: "div",
	classNameBindings: [
		":quick-bar-component",
		"isOpened:opened",
		"isLocked:locked"
	],

	isOpened: false,
	isLocked: false,

	timer: null,

	mouseEnter: function() {
		set( this, "isOpened", true );
	},

	mouseLeave: function() {
		if ( get( this, "isLocked" ) ) { return; }
		this.timer = later( set, this, "isOpened", false, 1000 );
	},


	clearTimer: function() {
		if ( this.timer ) {
			cancel( this.timer );
			this.timer = null;
		}
	}.on( "willDestroyElement", "mouseEnter" ),


	actions: {
		"menuClick": function() {
			this.toggleProperty( "isLocked" );
		}
	}
});
