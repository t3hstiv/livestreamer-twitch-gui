define([
	"Ember"
], function(
	Ember
) {

	return Ember.Component.extend({
		tagName: "section",
		classNameBindings: [ ":modal-body", "class" ]
	});

});
