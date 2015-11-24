import { merge } from "Ember";
import { Store } from "EmberData";
import {} from "EmberDataLS";


// no initializer here: just upgrade the application store

Store.reopen({
	/**
	 * Find a record and unload the generated record
	 * @param {string} modelName
	 * @param {string|number} id
	 * @param {Object?} options
	 * @param {boolean?} options.reload
	 * @returns {Promise.<EmberData.Model?>}
	 */
	findExistingRecord: function( modelName, id, options ) {
		var store = this;
		options = merge( { reload: true }, options );

		return store.findRecord( modelName, id, options )
			.catch(function() {
				// unload the generated empty record
				var record = store.peekRecord( modelName, id );
				if ( record ) {
					store.unloadRecord( record );
				}
				return Promise.reject();
			});
	}
});
