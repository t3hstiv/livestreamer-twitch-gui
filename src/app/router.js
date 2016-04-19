define([
	"Ember"
], function(
	Ember
) {

	var get = Ember.get;
	var set = Ember.set;

	var Router = Ember.Router.extend();

	Router.map(function() {

		this.route( "index", { path: "/" } );

		this.route( "watching" );

		this.route( "search", { path: "/search/:filter/:query" } );

		this.route( "featured" );

		this.route( "games", function() {
			this.route( "game", { path: "/:game" } );
		});

		this.route( "channels" );

		this.route( "channel", { path: "/channel/:channel" }, function() {
			this.route( "settings" );
		});

		this.route( "user", function() {
			this.route( "auth" );
			this.route( "subscriptions" );
			this.route( "followedStreams" );
			this.route( "hostedStreams" );
			this.route( "followedChannels" );
			this.route( "followedGames" );
		});

		this.route( "settings" );

		this.route( "about" );

	});


	Router.reopen({
		lastRouteName: "index",

		_updateLastRouteName: function() {
			var routeName = get( this, "currentRouteName" );
			if ( routeName && routeName !== "loading" && routeName !== "error" ) {
				set( this, "lastRouteName", routeName );
			}
		}.on( "willTransition" )
	});


	return Router;

});
