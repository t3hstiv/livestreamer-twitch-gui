define([
	"Ember",
	"utils/preload"
], function(
	Ember,
	preload
) {

	var get = Ember.get;
	var set = Ember.set;


	return Ember.Route.extend({
		model: function( params ) {
			var store = get( this, "store" );
			var id    = get( params, "channel" );

			// try to find a stream record if the channel is broadcasting
			var streamPromise = store.findRecord( "twitchStream", id, { reload: true } )
				.then(function( stream ) {
					return {
						stream : stream,
						channel: get( stream, "channel" )
					};
				}, function() {
					// let the stream record transition from root.loading into root.empty
					// so that it can be reloaded later on... fixes #89
					var stream = store.recordForId( "twitchStream", id );
					stream._internalModel.notFound();

					// if the channel is not online, just *fetch* the channel record
					return store.findRecord( "twitchChannel", id, { reload: true } )
						.then(function( channel ) {
							return {
								channel: channel
							};
						});
				})
				.then( preload([
					"stream.preview.large_nocache",
					"channel.logo",
					"channel.video_banner"
				]) );

			// load the channel panels in parallel
			var panelsPromise = store.findRecord( "twitchChannelPanel", id, { reload: true } )
				.then(function( panels ) {
					panels = get( panels, "panels" );

					return Promise.all( panels
						.filterBy( "kind", "default" )
						.sortBy( "display_order" )
						.map(function( panel ) {
							return Promise.resolve( panel )
								.then( preload( "image" ) );
						})
					);
				});

			// wait for both requests to resolve and add the panels obj to the stream/channel obj
			return Promise.all([
				streamPromise,
				panelsPromise
			])
				.then(function( data ) {
					data[0].panels = data[1];
					return data[0];
				});
		},

		resetController: function( controller, isExiting ) {
			if ( isExiting ) {
				set( controller, "isAnimated", false );
			}
		}
	});

});
