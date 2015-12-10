import { Route } from "Ember";


export default Route.extend({
	model: function() {
		return this.modelFor( "channel" );
	},

	refresh: function() {
		return this.container.lookup( "route:channel" ).refresh();
	}
});
