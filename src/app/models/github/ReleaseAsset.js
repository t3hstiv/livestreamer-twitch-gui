define( [ "EmberData" ], function( DS ) {

	var attr = DS.attr;

	return DS.Model.extend({
		browser_download_url: attr( "string" ),
		content_type: attr( "string" ),
		name: attr( "string" ),
		size: attr( "number" ),
		state: attr( "string" )

	}).reopenClass({
		toString: function() { return "releases"; }
	});

});
