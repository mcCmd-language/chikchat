import { BrowserWindow } from "electron";

export let win:BrowserWindow;

export function createWindow () {
    win = new BrowserWindow(
        {
            width: 1280,
            height: 720,
            minHeight:600,
            minWidth: 1000,
            center: true,
            autoHideMenuBar: true,
            titleBarStyle: "hidden",
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            }
        }
    );
    win.webContents.toggleDevTools();

    win.setMenu(null);
    win.loadFile('./html/login/index.html');
}
