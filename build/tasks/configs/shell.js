module.exports = {
	chocolatey: {
		command: [
			"cd build/package/chocolatey",
			"choco pack -y"
		].join( " && " )
	},

	win32installer: {
		command: "makensis -v3 build/package/win32installer/installer.nsi"
	},

	win64installer: {
		command: "makensis -v3 build/package/win64installer/installer.nsi"
	},

	osx32dmg: {
		command: [
			"which appdmg",
			// rename the .app folder
			"cd build/releases/<%= package.name %>/osx32",
			"mv <%= package.name %>.app \"<%= package.config['display-name'] %>.app\"",
			// build dmg image
			"cd ../../../..",
			"appdmg build/package/osx32dmg/appdmg.json "
				+ "\"dist/Install <%= package.config['display-name'] %> "
				+ "v<%= package.version %> osx32.dmg\"",
			// undo rename
			"cd build/releases/<%= package.name %>/osx32",
			"mv \"<%= package.config['display-name'] %>.app\" <%= package.name %>.app"
		].join( " && " )
	},

	osx64dmg: {
		command: [
			"which appdmg",
			// rename the .app folder
			"cd build/releases/<%= package.name %>/osx64",
			"mv <%= package.name %>.app \"<%= package.config['display-name'] %>.app\"",
			// build dmg image
			"cd ../../../..",
			"appdmg build/package/osx64dmg/appdmg.json "
				+ "\"dist/Install <%= package.config['display-name'] %> "
				+ "v<%= package.version %> osx64.dmg\"",
			// undo rename
			"cd build/releases/<%= package.name %>/osx64",
			"mv \"<%= package.config['display-name'] %>.app\" <%= package.name %>.app"
		].join( " && " )
	}
};
