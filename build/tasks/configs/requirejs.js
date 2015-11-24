module.exports = {
	options: {
		baseUrl       : "src/app",
		mainConfigFile: "src/app/config.js",

		name: "",
		out : "build/tmp/app/main.js",

		include: [ "main" ],
		exclude: [ "EmberHtmlbars", "EmberHtmlbarsWrapper" ],
		excludeShallow: [
			"requirejs/utils/fetch.optimizer",
			"requirejs/utils/write",
			"json!root/.babelrc",
			"BabelWrapper"
		],

		findNestedDependencies: true,
		generateSourceMaps    : false,
		optimize              : "none",

		skipModuleInsertion: false,
		wrap               : false,

		skipSemiColonInsertion : true,
		useStrict              : true,
		preserveLicenseComments: true,

		map: {
			"json": {
				"json": "../requirejs/plugins/json/json.optimizer"
			},
			"hbs": {
				"hbs": "../requirejs/plugins/hbs/hbs.optimizer"
			},
			"es6": {
				"es6": "../requirejs/plugins/es6/es6.optimizer"
			}
		}
	},

	dev: {
		options: {
			generateSourceMaps: true,

			paths: {
				"json": "../requirejs/plugins/json/json.prod",
				"hbs" : "../requirejs/plugins/hbs/hbs.prod",
				"es6" : "../requirejs/plugins/es6/es6.prod"
			}
		}
	},

	release: {
		options: {
			paths: {
				"json": "../requirejs/plugins/json/json.prod",
				"hbs" : "../requirejs/plugins/hbs/hbs.prod",
				"es6" : "../requirejs/plugins/es6/es6.prod",

				"Ember"    : "../vendor/ember/ember.prod",
				"EmberData": "../vendor/ember-data/ember-data.prod"
			}
		}
	},

	test: {
		options: {
			baseUrl       : "src/app",
			mainConfigFile: "src/app/config.js",

			out: "build/test/test/test-main.js",
			include: [ "test-main" ],
			exclude: null,

			shim: {
				"QUnit": {
					"exports": "QUnit"
				},
				"EmberTest": [ "Ember", "EmberData", "EmberHtmlbars" ]
			},

			map: {
				"json": {
					"json": "../requirejs/plugins/json/json.optimizer"
				},
				"es6": {
					"es6": "../requirejs/plugins/es6/es6.optimizer"
				}
			},

			paths: {
				"test-main": "../test/test-main",
				"tests": "../test/tests",

				"QUnit": "../vendor/qunit/qunit/qunit",
				"EmberTest": "../vendor/ember/ember-testing",

				"json": "../requirejs/plugins/json/json.prod",
				"es6" : "../requirejs/plugins/es6/es6.prod"
			}
		}
	}
};
