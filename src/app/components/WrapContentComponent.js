import { Component } from "Ember";
import layout from "hbs!templates/components/WrapContentComponent";


export default Component.extend({
	layout,

	didInitAttrs: function() {
		var tagName = this.attrs.tag;
		this.tagName = typeof tagName === "string"
			? tagName
			: "";
	}
});
