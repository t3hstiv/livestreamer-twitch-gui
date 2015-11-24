define(function() {

	return {
		pluginBuilder: "es6",

		load: function ( name, req, onload ) {
			req( [ name ], onload );
		}
	};

});
