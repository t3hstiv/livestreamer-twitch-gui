define([
	"Ember",
	"EmberData"
], function(
	Ember,
	DS
) {

	var get = Ember.get;
	var set = Ember.set;
	var merge = Ember.merge;
	var isNone = Ember.isNone;
	var AdapterError = DS.AdapterError;

	var errorProps = [
		"name",
		"title",
		"message",
		"detail",
		"description",
		"status",
		"host",
		"path"
	];

	var duplicates = {
		name   : [ "title" ],
		message: [ "detail", "description" ]
	};


	return Ember.Route.extend({
		/**
		 * Do all the error display stuff here instead of using an error controller.
		 * A route for errors is needed anyway.
		 * @param controller
		 * @param {(Error|Ember.RSVP.Promise)} error
		 */
		setupController: function( controller, error ) {
			this._super.call( this, controller );

			error = error || new Error( "Unknown error" );

			// if it's an AdapterError, just use the first error object
			if ( error instanceof AdapterError ) {
				merge( error, error.errors[0] || {} );
			}

			// choose a better error name
			if ( !error.name || error.name.toLowerCase() === "error" ) {
				error.name = error.title || error.constructor.name;
			}

			// remove duplicates
			Object.keys( duplicates ).forEach(function( key ) {
				var keys = duplicates[ key ];
				keys.forEach(function( dup ) {
					if ( error[ key ] === error[ dup ] ) {
						delete error[ dup ];
					}
				});
			});

			var props = errorProps.slice();

			// handle rejected promises with a passed Error object as reason
			var reason = get( error, "reason" );
			if ( reason instanceof Error ) {
				error = reason;
			} else if ( reason !== undefined ) {
				props.push( "reason" );
			}

			// display the callstack of non-adapter errors
			if ( DEBUG && error instanceof Error && !( error instanceof AdapterError ) ) {
				props.push( "stack" );
			}

			// create the model
			var model = props
				.filter(function( key ) {
					var value = error[ key ];
					return !isNone( value )
					    && !( value instanceof Object )
					    && String( value ).trim().length > 0
					    && value !== 0;
				})
				.map(function( key ) {
					return {
						key    : key.charAt( 0 ).toUpperCase() + key.slice( 1 ),
						value  : String( error[ key ] ),
						isStack: key === "stack"
					};
				});
			set( controller, "model", model );
		}
	});

});
