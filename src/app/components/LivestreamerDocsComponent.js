import {
	get,
	inject
} from "Ember";
import ExternalLinkComponent from "components/ExternalLinkComponent";
import layout from "hbs!templates/components/LivestreamerDocsComponent";


var { service } = inject;


export default ExternalLinkComponent.extend({
	metadata: service(),

	layout: layout,

	tagName: "span",
	classNameBindings: [ ":docs" ],
	attributeBindings: [ "title" ],
	title: "Read the documentation of this livestreamer parameter",

	url: function() {
		var url = get( this, "metadata.config.livestreamer-docs-url" );
		var cmd = get( this, "cmd" );

		return url.replace( "{cmd}", cmd );
	}.property( "cmd" )
});
