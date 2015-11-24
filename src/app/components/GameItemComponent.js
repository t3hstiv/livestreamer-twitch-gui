import {
	get,
	computed
} from "Ember";
import ListItemComponent from "components/ListItemComponent";
import layout from "hbs!templates/components/GameItemComponent";


var { or } = computed;


export default ListItemComponent.extend({
	layout,
	classNames: [ "game-item-component" ],

	action: "goto",

	game: or( "content.game", "content" ),
	hasStats: or( "content.channels", "content.viewers" ),

	click: function() {
		this.sendAction( "action", "games.game", get( this, "game.name" ) );
	}
});
