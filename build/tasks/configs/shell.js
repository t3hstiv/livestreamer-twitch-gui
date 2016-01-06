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
	}
};
