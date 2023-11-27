import { app, BrowserWindow, ipcMain } from "electron";
import { MainData } from "./main";

export let win:BrowserWindow;

export function createWindow () {
    win = new BrowserWindow(
        {
            width: 1280,
            height: 720,
            minHeight:600,
            minWidth: 1000,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            }
        }
    );
    //win.webContents.toggleDevTools();

    win.setMenu(null);
    win.loadFile('./html/home/index.html');
}