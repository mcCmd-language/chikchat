import { BrowserWindow, ipcMain } from "electron";
import path from "path";
import { MainData } from "./main";
import WebSocket from "ws";
import { api_url, ChatData } from "./chat";
import { sendNoti } from "./notification";
import { createTray } from "./tray";

export let win:BrowserWindow;

let lastNoti = 0;

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
            },
            icon: "./icon.png",
        }
    );
    //win.webContents.toggleDevTools();

    win.setMenu(null);
    win.loadFile('./html/login/index.html');

    createTray();

    if (!MainData.instance.ws) {
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
            const user = MainData.instance.users.find((x)=>{return e["from"] == x.id});
            const eb = {
                user: user!,
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
            
            if (user) {
                if (user.id === MainData.instance.selected && MainData.instance.where === "chat") return;
                
                sendNoti("message", user.decode().name, decodeURI(e["content"]), async ()=>{
                    win.show();

                    await win.loadFile("./html/chat/index.html");
                    
                    win.webContents.send("responseChatData", {
                        users: MainData.instance.users.map((v)=>v.withoutPw().decode()),
                        messages: ChatData.instance.messages,
                    }, MainData.instance.myAccount!.decode().id);
                });
            }
    
            win.webContents.send("responseChatSend", {
                messages: ChatData.instance.messages,
            });
        });
    }
}
