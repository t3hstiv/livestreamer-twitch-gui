import {
	get,
	Object as EmberObject
} from "Ember";
import {
	Menu,
	MenuItem,
	Tray,
	mainWindow
} from "nwjs/nwjs";


var isOSX = process.platform === "darwin";
var staticItems = [
	{
		label: "Toggle window",
		click: function( item, tray ) {
			tray.tray.emit( "click" );
		}
	},
	{
		label: "Close application",
		click: function() {
			mainWindow.close();
		}
	}
];


export default EmberObject.extend({
	init: function( name, icon, iconOSX ) {
		this.setProperties({
			name   : name,
			icon   : icon,
			iconOSX: iconOSX,
			tray   : null,
			items  : []
		});

		this.menu = new Menu();

		this.items.addArrayObserver( this, {
			willChange: function() {},
			didChange : this.itemsChanged
		});

		this.items.pushObjects( staticItems );
	},


	remove: function() {
		if ( this.tray ) {
			this.tray.remove();
			this.tray = null;
		}
	},

	add: function( click ) {
		this.tray = this._buildTray();
		this.tray.on( "click", click );
	},


	iconRes: function() {
		var dpr = window.devicePixelRatio;

		if ( isOSX ) {
			var hidpi = dpr > 2
				? "@3x"
				: dpr > 1
					? "@2x"
					: "";

			return get( this, "iconOSX" )
				.replace( "{res}", 18 )
				.replace( "{hidpi}", hidpi );

		} else {
			var res = dpr > 2
				? 48
				: dpr > 1
					? 32
					: 16;

			return get( this, "icon" )
				.replace( "{res}", res );
		}
	}.property( "icon", "iconOSX" ),

	_buildTray: function() {
		var tray = new Tray({
			icon   : get( this, "iconRes" ),
			tooltip: get( this, "name" )
		});
		tray.menu = this.menu;
		return tray;
	},

	itemsChanged: function( items ) {
		// a new menu needs to be built and applied
		// modifying already attached menus has no effect
		// setting the menu property on the tray object to null causes nwjs to crash
		var menu = new Menu();

		items.forEach(function( item ) {
			var menuitem = new MenuItem({
				type   : item.type || "normal",
				enabled: item.enabled === undefined
					? true
					: item.enabled,
				label  : item.label,
				tooltip: item.tooltip || "",
				checked: item.checked
			});
			menuitem.click = item.click.bind( null, menuitem, this );

			menu.append( menuitem );
		}, this );

		this.menu = menu;
		if ( this.tray ) {
			this.tray.menu = menu;
		}
	}
}).create();
