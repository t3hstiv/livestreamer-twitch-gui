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
	},

	"win32installer": {
		"options": {
			"data": {
				"name"       : "<%= package.name %>",
				"displayname": "<%= package.config['display-name'] %>",
				"version"    : "<%= package.version %>",
				"author"     : "<%= package.author %>",
				"homepage"   : "<%= package.homepage %>",
				"arch"       : "<%= package.config.releases.platforms.win32.ia32 %>"
			}
		},
		"files": {
			"build/package/win32installer/installer.nsi":
				"build/resources/package/wininstaller/installer.nsi.tpl"
		}
	},

	"win64installer": {
		"options": {
			"data": {
				"name"       : "<%= package.name %>",
				"displayname": "<%= package.config['display-name'] %>",
				"version"    : "<%= package.version %>",
				"author"     : "<%= package.author %>",
				"homepage"   : "<%= package.homepage %>",
				"arch"       : "<%= package.config.releases.platforms.win32.x64 %>"
			}
		},
		"files": {
			"build/package/win64installer/installer.nsi":
				"build/resources/package/wininstaller/installer.nsi.tpl"
		}
	},

	"osx32dmg": {
		"options": {
			"data": {
				"name"       : "<%= package.name %>",
				"displayname": "<%= package.config['display-name'] %>"
			}
		},
		"files": {
			"build/package/osx32dmg/appdmg.json":
				"build/resources/package/osxdmg/appdmg.json.tpl"
		}
	},

	"osx64dmg": {
		"options": {
			"data": {
				"name"       : "<%= package.name %>",
				"displayname": "<%= package.config['display-name'] %>"
			}
		},
		"files": {
			"build/package/osx64dmg/appdmg.json":
				"build/resources/package/osxdmg/appdmg.json.tpl"
		}
	}
};
