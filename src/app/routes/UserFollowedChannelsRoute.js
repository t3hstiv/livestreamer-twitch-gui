import { get } from "Ember";
import UserIndexRoute from "routes/UserIndexRoute";
import InfiniteScrollMixin from "mixins/InfiniteScrollMixin";
import ModelMetadataMixin from "mixins/ModelMetadataMixin";
import preload from "utils/preload";


export default UserIndexRoute.extend( InfiniteScrollMixin, ModelMetadataMixin, {
	itemSelector: ".channel-item-component",

	queryParams: {
		sortby: {
			refreshModel: true
		},
		direction: {
			refreshModel: true
		}
	},

	modelName: "twitchChannelsFollowed",

	model: function( params ) {
		return get( this, "store" ).query( this.modelName, {
			offset   : get( this, "offset" ),
			limit    : get( this, "limit" ),
			sortby   : params.sortby || "created_at",
			direction: params.direction || "desc"
		})
			.then(function( data ) {
				return data.mapBy( "channel" ).toArray();
			})
			.then( preload( "logo" ) );
	},

	fetchContent: function() {
		return this.model({
			sortby   : get( this, "controller.sortby" ),
			direction: get( this, "controller.direction" )
		});
	}
});
