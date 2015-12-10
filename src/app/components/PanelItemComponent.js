import { Component } from "Ember";
import layout from "hbs!templates/components/PanelItemComponent";


export default Component.extend({
	layout,
	tagName: "li",
	classNames: [ "panel-item-component" ],

	didInsertElement: function() {
		var self = this;

		this.$( "a" )
			.addClass( "external-link" )
			.each(function() {
				this.setAttribute( "title", this.href );
			})
			.click(function( e ) {
				e.preventDefault();
				e.stopImmediatePropagation();
				self.send( "openBrowser", this.href );
			});

		this._super( ...arguments );
	},

	action: "openBrowser",

	actions: {
		"openBrowser": function( url ) {
			this.sendAction( "action", url );
		}
	}
});
