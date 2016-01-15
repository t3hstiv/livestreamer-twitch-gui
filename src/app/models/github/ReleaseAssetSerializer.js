define([
	"Ember",
	"EmberData",
	"models/github/ReleaseAsset"
], function(
	Ember,
	DS,
	ReleaseAsset
) {

	var get = Ember.get;
	var attrs = get( ReleaseAsset, "attributes" );


	return DS.RESTSerializer.extend({
		modelNameFromPayloadKey: function() {
			return "githubReleaseAsset";
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
