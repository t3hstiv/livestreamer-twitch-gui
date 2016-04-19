define([
	"Ember",
	"mixins/RetryTransitionMixin",
	"utils/wait"
], function(
	Ember,
	RetryTransitionMixin,
	wait
) {

	var get = Ember.get;
	var set = Ember.set;


	return Ember.Controller.extend( RetryTransitionMixin, {
		auth    : Ember.inject.service(),
		settings: Ember.inject.service(),

		retryTransition: function() {
			// use "user.index" as default route
			return this._super( "user.index" );
		},

		token: "",

		scope: function() {
			return get( this, "auth.oauth.scope" ).join( ", " );
		}.property( "auth.oauth.scope" ),

		/**
		 * 0 000: start
		 * 1 001: auth  - login (server started)
		 * 2 010: auth  - failure
		 * 3 011: auth  - success (not used)
		 * 4 100: token - show form
		 * 5 101: token - login (form submitted)
		 * 6 110: token - failure
		 * 7 111: token - success
		 */
		loginStatus: 0,

		userStatus: function() {
			return get( this, "loginStatus" ) & 3;
		}.property( "loginStatus" ),

		hasUserInteraction: function() {
			return get( this, "userStatus" ) > 0;
		}.property( "userStatus" ),

		isLoggingIn: function() {
			return get( this, "loginStatus" ) === 1;
		}.property( "loginStatus" ),

		hasLoginResult: function() {
			var userStatus = get( this, "userStatus" );
			return ( userStatus & 2 ) > 0;
		}.property( "userStatus" ),

		showFailMessage: function() {
			return get( this, "userStatus" ) === 2;
		}.property( "userStatus" ),

		showTokenForm: function() {
			return get( this, "loginStatus" ) & 4;
		}.property( "loginStatus" ),


		serverObserver: function() {
			var authServer = get( this, "auth.server" );
			set( this, "loginStatus", authServer ? 1 : 0 );
		}.observes( "auth.server" ),


		resetProperties: function() {
			set( this, "token", "" );
			set( this, "loginStatus", 0 );
		},


		actions: {
			"showTokenForm": function() {
				set( this, "loginStatus", 4 );
			},

			// login via user and password
			"signin": function() {
				if ( get( this, "isLoggingIn" ) ) { return; }
				set( this, "loginStatus", 1 );

				var self = this;
				var auth = get( this, "auth" );

				auth.signin()
					.then( function() {
						set( self, "loginStatus", 3 );
						self.retryTransition();
					})
					.catch(function() {
						set( self, "loginStatus", 2 );
						wait( 3000 )()
							.then(function() {
								set( self, "loginStatus", 0 );
							});
					});
			},

			// login via access token
			"signinToken": function( success, failure ) {
				if ( get( this, "isLoggingIn" ) ) { return; }
				set( this, "loginStatus", 5 );

				var self  = this;
				var token = get( this, "token" );
				var auth  = get( this, "auth" );

				// show the loading icon for a sec and wait
				wait( 1000 )()
					// login attempt
					.then( auth.login.bind( auth, token, false ) )
					// visualize result: update button and icon
					.then(function() {
						set( self, "loginStatus", 7 );
						return wait( 1000 )( true )
							.then( success );
					}, function() {
						set( self, "loginStatus", 6 );
						return wait( 3000 )( false )
							.then( failure )
							.catch(function( data ) { return data; });
					})
					// retry transition on success
					.then(function( result ) {
						set( self, "loginStatus", 4 );
						if ( result ) {
							self.retryTransition();
						}
					});
			},

			// abort sign in with username + password
			"abort": function() {
				get( this, "auth" ).abortSignin();
			}
		}
	});

});
