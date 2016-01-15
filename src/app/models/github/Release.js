define( [ "EmberData" ], function( DS ) {

	var attr = DS.attr;
	var hasMany = DS.hasMany;

	return DS.Model.extend({
		assets: hasMany( "githubReleaseAsset", { async: true } ),
		body: attr( "string" ),
		draft: attr( "boolean" ),
		html_url: attr( "string" ),
		prerelease: attr( "boolean" ),
		published_at: attr( "date" ),
		tag_name: attr( "string" )

	}).reopenClass({
		toString: function() { return "releases"; }
	});

});
