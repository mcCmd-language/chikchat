import { ipcMain } from "electron";
import { win } from "./window";

ipcMain.on("requestManageData", async (ev)=>{
    await win.loadFile("./html/manage/index.html");

    ev.reply("responseManageData");
});
