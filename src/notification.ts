import { ipcMain } from "electron";
import { win } from "./window";

const eventMap = new Map<string, ()=>void>()

export function sendNoti(id: string, title: string, body: string, event = ()=>{}): void {
    win.webContents.send("notification", id, title, body);

    eventMap.set(id, event);
}

ipcMain.on("responseNoti", (ev, id)=>{
    const event = eventMap.get(id);

    if (event) {
        event();
        eventMap.delete(id);
    }
});
