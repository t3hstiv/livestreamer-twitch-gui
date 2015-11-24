import { get } from "Ember";
import UserIndexRoute from "routes/UserIndexRoute";
import InfiniteScrollMixin from "mixins/InfiniteScrollMixin";
import ModelMetadataMixin from "mixins/ModelMetadataMixin";
import preload from "utils/preload";


export default UserIndexRoute.extend( InfiniteScrollMixin, ModelMetadataMixin, {
	itemSelector: ".stream-item-component",

	modelName: "twitchStreamsFollowed",

	model: function() {
		return get( this, "store" ).query( this.modelName, {
			offset: get( this, "offset" ),
			limit : get( this, "limit" )
		})
			.then(function( data ) {
				return data.mapBy( "stream" ).toArray();
			})
			.then( preload( "preview.medium_nocache" ) );
	}
});
