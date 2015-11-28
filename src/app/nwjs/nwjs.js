const nwGui = window.nwDispatcher.requireNwGui();

const App        = nwGui.App;
const Clipboard  = nwGui.Clipboard;
const Menu       = nwGui.Menu;
const MenuItem   = nwGui.MenuItem;
const Screen     = nwGui.Screen.Init();
const Shell      = nwGui.Shell;
const Tray       = nwGui.Tray;
const Window     = nwGui.Window;
const mainWindow = Window.get();


export default nwGui;
export {
	App,
	Clipboard,
	Menu,
	MenuItem,
	Screen,
	Shell,
	Tray,
	Window,
	mainWindow
};
