import { Component } from "Ember";
import layout from "hbs!templates/components/StatsRowComponent";


export default Component.extend({
	layout: layout,
	tagName: "div",
	classNameBindings: [ ":stats-row-component", "class" ],

	withFlag: true
});
