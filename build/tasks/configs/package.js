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
	},

	"osx32dmg": {
		tasks: [
			"clean:package_osx32dmg",
			"copy:package_osx32dmg",
			"template:osx32dmg",
			"shell:osx32dmg"
		]
	},
	"osx64dmg": {
		tasks: [
			"clean:package_osx64dmg",
			"copy:package_osx64dmg",
			"template:osx64dmg",
			"shell:osx64dmg"
		]
	}
};
