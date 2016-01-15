define([
	"Ember",
	"EmberData",
	"models/github/Release"
], function(
	Ember,
	DS,
	Release
) {

	var get = Ember.get;
	var attrs = get( Release, "attributes" );


	return DS.RESTSerializer.extend({
		modelNameFromPayloadKey: function() {
			return "githubRelease";
		},

		attrs: {
			assets: { deserialize: "records" }
		},

		normalizeResponse: function( store, primaryModelClass, payload, id, requestType ) {
			payload = {
				githubRelease: payload
			};

			return this._super( store, primaryModelClass, payload, id, requestType );
		},

		normalize: function( modelClass, resourceHash, prop ) {
			var primaryKey = get( this, "primaryKey" );

			// remove unwanted properties from the payload
			Object.keys( resourceHash ).forEach(function( key ) {
				if ( key !== primaryKey && !attrs.has( key ) ) {
					delete resourceHash[ key ];
				}
			});

			return this._super( modelClass, resourceHash, prop );
		}
	});

});
