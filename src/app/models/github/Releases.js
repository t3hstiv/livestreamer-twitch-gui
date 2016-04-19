define([
	"EmberData"
], function(
	DS
) {

	var attr = DS.attr;


	return DS.Model.extend({
		assets: attr(),
		assets_url: attr(),
		author: attr(),
		body: attr(),
		created_at: attr(),
		draft: attr( "boolean" ),
		html_url: attr( "string" ),
		name: attr(),
		prerelease: attr(),
		published_at: attr(),
		tag_name: attr( "string" ),
		tarball_url: attr(),
		target_commitish: attr(),
		upload_url: attr(),
		url: attr(),
		zipball_url: attr()

	}).reopenClass({
		toString: function() { return "releases"; }
	});

});
