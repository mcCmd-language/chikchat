import { ipcMain } from "electron";
import { User } from "./user";
import { MainData } from "./main";
import { win } from "./window";
import axios from "axios";
import { getUsers } from "./login_register";

export const api_url = "https://backend.misilelaboratory.xyz";

export interface message {
    user: User;
    msg: string;
    isMine: boolean;
    sendTo?: string;
    time: number;
}

export class ChatData {
    public static instance = new ChatData();

    messages: message[] = [];
    selected?: User;
}

ipcMain.on("requestChatData", async (ev)=>{
    await win.loadFile("./html/chat/index.html");

    ev.reply("responseChatData", {
        users: MainData.instance.users.map((v)=>v.withoutPw().decode()),
        messages: ChatData.instance.messages,
    }, MainData.instance.myAccount!.decode().id);

    await getUsers((d)=>{MainData.instance.users = d;})
});

ipcMain.on("requestChatSend", async (ev, arg)=>{
    if (!MainData.instance.myAccount) return;

    ChatData.instance.messages.push(
        {
            user: MainData.instance.myAccount.withoutPw(),
            msg: arg.msg,
            isMine: true,
            sendTo: arg.selected,
            time: Date.now(),
        },
    );

    ev.reply("responseChatSend", {
        messages: ChatData.instance.messages,
    });

    await axios.post(`${api_url}/msg`, {}, 
        {
            headers: {
                from: MainData.instance.myAccount.encode().id,
                to: encodeURI(arg.selected),
                content: encodeURI(arg.msg),
            },
        },
    );
});
