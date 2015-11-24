import {
	set,
	Component
} from "Ember";
import layout from "hbs!templates/components/PreviewImageComponent";


export default Component.extend({
	layout: layout,

	classNames: [],
	error: false,

	checkError: function() {
		var self = this;
		this.$( "img" ).one( "error", function() {
			set( self, "error", true );
		});
	}.on( "willInsertElement" )
});
