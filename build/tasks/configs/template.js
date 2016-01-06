module.exports = {
	"chocolatey": {
		"options": {
			"data": {
				"name"        : "<%= package.name %>",
				"version"     : "<%= package.version %>",
				"author"      : "<%= package.author %>",
				"homepage"    : "<%= package.homepage %>",
				"releaseNotes": "<%= package.chocolatey.releaseNotes %>"
			}
		},
		"files": {
			"build/package/chocolatey/livestreamer-twitch-gui.nuspec":
				"build/resources/package/chocolatey/livestreamer-twitch-gui.nuspec.tpl",
			"build/package/chocolatey/tools/chocolateyinstall.ps1":
				"build/resources/package/chocolatey/tools/chocolateyinstall.ps1.tpl",
			"build/package/chocolatey/tools/chocolateyuninstall.ps1":
				"build/resources/package/chocolatey/tools/chocolateyuninstall.ps1.tpl"
		}
	}
};
