import {
	computed,
	inject,
	Controller
} from "Ember";


var { sort } = computed;
var { service } = inject;


export default Controller.extend({
	auth: service(),

	sortedModel: sort( "model", "sortBy" ),
	sortBy: [ "started:desc" ]
});
