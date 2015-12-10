import {
	run,
	Component
} from "Ember";
import Masonry from "Masonry";
import layout from "hbs!templates/components/ChannelPanelsComponent";


const { scheduleOnce } = run;


export default Component.extend({
	layout,
	tagName: "section",
	classNames: [ "content", "content-panels" ],

	action: "openBrowser",

	_masonry: function() {
		var container = this.$( "ul" )[0];
		scheduleOnce( "afterRender", function() {
			return new Masonry( container, {
				itemSelector: ".panel-item-component",
				columnWidth: ".panel-item-component",
				transitionDuration: 0
			});
		});
	}.on( "didInsertElement" ),

	actions: {
		openBrowser: function( url ) {
			this.sendAction( "action", url );
		}
	}
});
