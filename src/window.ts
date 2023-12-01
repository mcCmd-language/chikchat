import { BrowserWindow, ipcMain } from "electron";
import path from "path";
import { MainData } from "./main";
import WebSocket from "ws";
import { api_url, ChatData } from "./chat";

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

    MainData.instance.ws = new WebSocket(api_url + "/ws");
    MainData.instance.ws.on("open", ()=>{console.log("open");})
    MainData.instance.ws.on("message", (a)=>{
        console.log(a.toString());
        let e:Record<string, any> = {};
        try {
            e = JSON.parse(a.toString());
            console.log(e);
        } catch(x) {
            console.error(x);

            return;
        }
        if (MainData.instance.myAccount?.id === e["from"]) {return;}
        console.log(1);
        const eb = {
            user: MainData.instance.users.filter((x)=>{return e["from"] == x.id})[0],
            msg: e["content"],
            time: e["time"],
            sendTo: e["to"],
            isMine: false
        };
        if (eb.user) {
            if (eb.user.id == MainData.instance.myAccount?.id) {
                console.log(-1);
                return;
            }
        }
        ChatData.instance.messages.push(eb);
        console.log(ChatData.instance.messages);

        win.webContents.send("responseChatSend", {
            messages: ChatData.instance.messages,
        });
    });
}
