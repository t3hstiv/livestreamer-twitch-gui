import {
	computed,
	Service
} from "Ember";
import metadata from "json!root/metadata";


var { alias } = computed;


export default Service.extend({
	metadata: metadata,

	package     : alias( "metadata.package" ),
	config      : alias( "metadata.package.config" ),
	dependencies: alias( "metadata.dependencies" ),
	contributors: alias( "metadata.contributors" )
});
