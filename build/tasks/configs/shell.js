module.exports = {
	chocolatey: {
		command: [
			"cd build/package/chocolatey",
			"choco pack -y"
		].join( " && " )
	}
};
