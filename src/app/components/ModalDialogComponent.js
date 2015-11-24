import {
	computed,
	Component
} from "Ember";
import layout from "hbs!templates/components/ModalDialogComponent";


var { or } = computed;


export default Component.extend({
	layout: layout,

	tagName: "section",
	classNameBindings: [ ":modal-dialog-component", "class" ],

	head: or( "context.modalHead", "context.head" ),
	body: or( "context.modalBody", "context.body" ),

	/*
	 * This will be called synchronously, so we need to copy the element and animate it instead
	 */
	willDestroyElement: function() {
		var $this  = this.$();
		var $clone = $this.clone().addClass( "fadeOut" );
		$this.parent().append( $clone );
		$clone.one( "webkitAnimationEnd", function() { $clone.remove(); });
	}
});
