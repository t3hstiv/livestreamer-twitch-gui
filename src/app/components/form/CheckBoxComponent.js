define([
	"Ember",
	"hbs!templates/components/form/CheckBoxComponent"
], function(
	Ember,
	layout
) {

	return Ember.Component.extend({
		layout: layout,
		tagName: "label"
	});

});
