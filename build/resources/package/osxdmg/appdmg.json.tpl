{
	"title": "<%= displayname %>",
	"icon": "../../resources/icons/icon-1024.icns",
	"background": "appdmg.png",
	"icon-size": 90,
	"contents": [
		{
			"x": 430,
			"y": 180,
			"type": "link",
			"path": "/Applications"
		},
		{
			"x": 210,
			"y": 180,
			"type": "file",
			"path": "../../releases/<%= name %>/osx64/<%= displayname %>.app"
		}
	]
}
