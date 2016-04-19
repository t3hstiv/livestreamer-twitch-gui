define([
	"store/TwitchSerializer"
], function(
	TwitchSerializer
) {

	return TwitchSerializer.extend({
		modelNameFromPayloadKey: function() {
			return "twitchSearchChannel";
		},

		attrs: {
			channel: { deserialize: "records" }
		},

		normalizeResponse: function( store, primaryModelClass, payload, id, requestType ) {
			payload.channels = ( payload.channels || [] ).map(function( hash ) {
				return {
					channel: hash
				};
			});

			return this._super( store, primaryModelClass, payload, id, requestType );
		},

		normalize: function( modelClass, resourceHash, prop ) {
			var foreignKey = this.store.serializerFor( "twitchGame" ).primaryKey;
			resourceHash[ this.primaryKey ] = resourceHash.channel[ foreignKey ];

			return this._super( modelClass, resourceHash, prop );
		}
	});

});
