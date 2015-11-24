import {
	get,
	Route
} from "Ember";
import preload from "utils/preload";


export default Route.extend({
	model: function() {
		var records = get( this.controllerFor( "livestreamer" ), "model" );

		return Promise.resolve( records.mapBy( "stream" ).toArray() )
			.then( preload( "preview.large_nocache" ) )
			// return the original record array
			.then(function() { return records; });
	}
});
