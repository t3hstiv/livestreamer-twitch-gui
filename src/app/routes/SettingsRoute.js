import {
	get,
	inject,
	Route
} from "Ember";
import ObjectBuffer from "utils/ember/ObjectBuffer";


var { service } = inject;


export default Route.extend({
	settings: service(),

	model: function() {
		var settings = get( this, "settings.content" );
		return ObjectBuffer.create({
			content: settings.toJSON()
		});
	},

	actions: {
		willTransition: function( transition ) {
			// if the user has changed any values
			if ( get( this.controller, "model.isDirty" ) ) {
				// stay here...
				transition.abort();

				// and let the user decide
				this.send( "openModal", "settings", this.controller, {
					previousTransition: transition
				});
			}
		}
	}
});
