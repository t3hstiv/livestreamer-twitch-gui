module.exports = {
	"chocolatey": {
		"tasks": [
			"clean:package_chocolatey",
			"template:chocolatey",
			"shell:chocolatey"
		]
	},

	"win32installer": {
		"tasks": [
			"clean:package_win32installer",
			"template:win32installer",
			"shell:win32installer"
		]
	},

	"win64installer": {
		"tasks": [
			"clean:package_win64installer",
			"template:win64installer",
			"shell:win64installer"
		]
	}
};
