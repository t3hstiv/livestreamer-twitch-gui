define([
	"Ember",
	"hbs!templates/components/PreviewImageComponent"
], function(
	Ember,
	layout
) {

	var set = Ember.set;


	return Ember.Component.extend({
		layout: layout,

		classNames: [],
		error: false,

		checkError: function() {
			var self = this;
			var img  = this.element.querySelector( "img" );

			function unbind() {
				img.removeEventListener( "error", onError, false );
				img.removeEventListener( "load",  onLoad,  false );
			}

			function onError() {
				unbind();
				set( self, "error", true );
			}

			function onLoad() {
				unbind();
			}

			img.addEventListener( "error", onError, false );
			img.addEventListener( "load",  onLoad,  false );
		}.on( "willInsertElement" )
	});

});
