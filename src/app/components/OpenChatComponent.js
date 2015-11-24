import {
	get,
	inject
} from "Ember";
import FormButtonComponent from "components/FormButtonComponent";


var { service } = inject;


export default FormButtonComponent.extend({
	metadata: service(),
	chat    : service(),

	"class" : "btn-hint",
	icon    : "fa-comments",
	title   : "Open chat",
	iconanim: true,

	action: "chat",

	actions: {
		"chat": function( success, failure ) {
			var channel = get( this, "channel" );
			var chat    = get( this, "chat" );
			chat.open( channel )
				.then( success, failure )
				.catch(function(){});
		}
	}
});
