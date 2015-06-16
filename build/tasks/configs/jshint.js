module.exports = {
	app: {
		options: {
			jshintrc: "src/.jshintrc"
		},
		src    : [ "src/**/*.js", "!src/vendor/**", "!src/test/**" ]
	},

	test: {
		options: {
			jshintrc: "src/test/.jshintrc"
		},
		src    : [ "src/test/*.js", "src/test/**/*.js", "!src/test/src/**" ]
	},

	tasks: {
		options: {
			jshintrc: "build/tasks/.jshintrc"
		},
		src    : [ "build/tasks/**/*.js" ]
	}
};
