import {
	get,
	set,
	computed,
	$,
	Component
} from "Ember";
import layout from "hbs!templates/components/InfiniteScrollComponent";


var { alias, or } = computed;

var $window = $( window );


export default Component.extend({
	layout,
	tagName: "button",
	classNameBindings: [
		":btn",
		":btn-with-icon",
		":infinite-scroll-component",
		"hasFetchedAll:hidden"
	],
	attributeBindings: [
		"type",
		"locked:disabled"
	],

	scrollThreshold: 2 / 3,
	scrollListener : null,

	type: "button",
	locked: or( "isFetching", "hasFetchedAll" ),
	error: alias( "targetObject.fetchError" ),

	isFetching: alias( "targetObject.isFetching" ),
	hasFetchedAll: alias( "targetObject.hasFetchedAll" ),

	click: function() {
		var targetObject = get( this, "targetObject" );
		targetObject.send( "willFetchContent", true );
	},


	didInsertElement: function() {
		this._super();

		var $elem     = this.$().parent();
		var threshold = get( this, "scrollThreshold" );
		var target    = get( this, "targetObject" );
		var listener  = this.infiniteScroll.bind( this, $elem[ 0 ], threshold, target );

		set( this, "scrollListener", listener );

		$elem.on( "scroll", listener );
		$window.on( "resize", listener );
	},

	willDestroyElement: function() {
		this._super();

		var scrollListener = get( this, "scrollListener" );
		var $elem = this.$();
		$elem.parent().off( "scroll", scrollListener );
		$window.off( "resize", scrollListener );

		set( this, "scrollListener", null );
	},

	infiniteScroll: function( elem, percentage, target ) {
		var threshold = percentage * elem.clientHeight;
		var remaining = elem.scrollHeight - elem.clientHeight - elem.scrollTop;
		if ( remaining <= threshold ) {
			target.send( "willFetchContent" );
		}
	}
});
