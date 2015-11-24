import {
	inject,
	Component
} from "Ember";


var { service } = inject;


export default Component.extend({
	settings: service(),

	tagName: "li",
	classNameBindings: [ "isNewItem:newItem" ],

	isNewItem: false
});
