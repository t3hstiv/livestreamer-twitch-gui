import {
	get,
	computed,
	inject
} from "Ember";
import Moment from "Moment";
import ListItemComponent from "components/ListItemComponent";
import layout from "hbs!templates/components/SubscriptionItemComponent";


var { alias } = computed;
var { service } = inject;


export default ListItemComponent.extend({
	metadata: service(),

	layout,
	classNames: [ "subscription-item-component" ],
	attributeBindings: [ "style" ],

	product  : alias( "content.product" ),
	channel  : alias( "product.partner_login" ),
	emoticons: alias( "product.emoticons" ),

	style: function() {
		var banner =  get( this, "channel.profile_banner" )
		           || get( this, "channel.video_banner" )
		           || "";
		return `background-image:url("${ banner }")`.htmlSafe();
	}.property( "channel.profile_banner", "channel.video_banner" ),

	hasEnded: function() {
		var access_end = get( this, "content.access_end" );
		return new Date() > access_end;
	}.property( "content.access_end" ).volatile(),

	ends: function() {
		var access_end = get( this, "content.access_end" );
		return new Moment().to( access_end );
	}.property( "content.access_end" ).volatile(),


	buttonAction: "openBrowser",
	openBrowser: function( url ) {
		var channel = get( this, "channel.id" );
		this.sendAction( "buttonAction", url.replace( "{channel}", channel ) );
	},


	actions: {
		edit: function( success ) {
			var url = get( this, "metadata.config.twitch-subscribe-edit" );
			this.openBrowser( url );
			if ( success instanceof Function ) {
				success();
			}
		},

		cancel: function( success ) {
			var url = get( this, "metadata.config.twitch-subscribe-cancel" );
			this.openBrowser( url );
			if ( success instanceof Function ) {
				success();
			}
		}
	}
});
