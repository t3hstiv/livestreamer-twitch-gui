import {
	get,
	inject,
	Route
} from "Ember";
import nwGui from "nwjs/nwGui";


var { service } = inject;
var reModalTemplateName = /^(?:Modal)?(\w)(\w+)(?:Modal)?$/i;

function fnModalTemplateName( _, a, b ) {
	return "modal" + a.toUpperCase() + b;
}


export default Route.extend({
	settings: service(),

	init: function() {
		this._super();
		this.controllerFor( "versioncheck" );
	},

	actions: {
		"history": function( action ) {
			window.history.go( +action );
		},

		"refresh": function() {
			var routeName = get( this.controller, "currentRouteName" );
			if ( routeName !== "error" ) {
				this.container.lookup( "route:" + routeName ).refresh();
			}
		},

		"goto": function( routeName ) {
			var currentRoute = get( this.controller, "currentRouteName" );
			if ( routeName === currentRoute ) {
				this.send( "refresh" );
			} else {
				this.transitionTo.apply( this, arguments );
			}
		},

		"gotoHomepage": function( noHistoryEntry ) {
			var homepage = get( this, "settings.gui_homepage" );
			var method   = noHistoryEntry
				? "replaceWith"
				: "transitionTo";
			this.router[ method ]( homepage || "/featured" );
		},

		"openBrowser": function( url ) {
			nwGui.Shell.openExternal( url );
		},

		"openLivestreamer": function( stream ) {
			this.controllerFor( "livestreamer" ).startStream( stream );
		},

		"openModal": function( template, controller, data ) {
			template = template.replace( reModalTemplateName, fnModalTemplateName );

			if ( typeof controller === "string" ) {
				controller = this.controllerFor( controller );
			}
			if ( controller && data instanceof Object ) {
				controller.setProperties( data );
			}

			this.render( template, {
				into      : "application",
				outlet    : "modal",
				controller: controller
			});
		},

		"closeModal": function() {
			this.disconnectOutlet({
				parentView: "application",
				outlet    : "modal"
			});
		}
	}
});
