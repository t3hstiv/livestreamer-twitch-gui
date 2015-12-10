import {
	get,
	Component
} from "Ember";
import layout from "hbs!templates/components/StreamPresentationComponent";


export default Component.extend({
	layout,

	tagName: "section",
	classNameBindings: [ ":stream-presentation-component", "class" ],
	"class": "",

	clickablePreview: true,
	action: "openLivestreamer",

	actions: {
		"previewClick": function( stream ) {
			if ( !get( this, "clickablePreview" ) ) { return; }
			this.sendAction( "action", stream );
		}
	}
});
