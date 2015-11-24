import {
	get,
	computed,
	inject
} from "Ember";
import nwGui from "nwjs/nwGui";
import FormButtonComponent from "components/FormButtonComponent";


var { and, or } = computed;
var { service } = inject;


export default FormButtonComponent.extend({
	metadata: service(),
	settings: service(),

	showButton: false,
	isEnabled : or( "showButton", "settings.content.gui_twitchemotes" ),
	isVisible : and( "isEnabled", "channel.partner" ),

	"class" : "btn-neutral",
	icon    : "fa-smile-o",
	iconanim: true,
	title   : "Show available channel emotes",

	action: "openTwitchEmotes",

	actions: {
		"openTwitchEmotes": function( success, failure ) {
			var url = get( this, "metadata.config.twitch-emotes-url" );
			var channel = get( this, "channel.id" );

			if ( url && channel ) {
				url = url.replace( "{channel}", channel );
				nwGui.Shell.openExternal( url );
				success();

			} else {
				failure();
			}
		}
	}
});
