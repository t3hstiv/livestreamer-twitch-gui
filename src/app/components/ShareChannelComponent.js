import {
	get,
	inject
} from "Ember";
import { Clipboard } from "nwjs/nwjs";
import FormButtonComponent from "components/FormButtonComponent";


var { service } = inject;


export default FormButtonComponent.extend({
	metadata: service(),

	"class" : "btn-info",
	icon    : "fa-share-alt",
	title   : "Copy channel url to clipboard",
	iconanim: true,

	action: "share",

	actions: {
		"share": function( success, failure ) {
			var url = get( this, "channel.url" );
			var cb  = Clipboard.get();

			if ( url && cb ) {
				cb.set( url, "text" );

				if ( success instanceof Function ) {
					success();
				}
			} else if ( failure instanceof Function ) {
				failure().catch();
			}
		}
	}
});
