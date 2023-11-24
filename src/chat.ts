import { ipcMain } from "electron";
import { User } from "./user";
import { MainData } from "./main";
import { win } from "./window";

interface message {
    user: User;
    msg: string;
}

class ChatData {
    public static instance = new ChatData();

    messages: message[] = [];
}

ipcMain.on("requestChatData", async (ev)=>{
    await win.loadFile("./html/chat/index.html");
    ev.reply("responseChatData", {
        users: MainData.instance.users,
        messages: ChatData.instance.messages,
    });
});

ipcMain.on("requestChatSend", (ev, arg1)=>{
    ev.reply("responseChatSend", {
        messages: ChatData.instance.messages,
    });
});
