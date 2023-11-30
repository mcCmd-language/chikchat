import { ipcMain } from "electron";
import { User } from "./user";
import { MainData } from "./main";
import { win } from "./window";
import axios from "axios";

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
        users: MainData.instance.users.map((v)=>v.withoutPw()),
        messages: ChatData.instance.messages,
    }, MainData.instance.myAccount!.id);

    await axios.get(api_url + "/users").then((v)=>{
        const classList: User[] = [];
        v.data.forEach((element: any) => {
            classList.push(new User(element["username"],element["accid"],element["description"], undefined, element["image"]))
        });
        MainData.instance.users = classList;
    })
});

ipcMain.on("requestChatSend", async (ev, arg1, arg2)=>{
    if (!MainData.instance.myAccount) return;

    ChatData.instance.messages.push(
        {
            user: MainData.instance.myAccount.withoutPw(),
            msg: arg1,
            isMine: true,
            sendTo: arg2,
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
                to: encodeURI(arg2),
                content: encodeURI(arg1),
            }
        },
    ).catch((x)=>{if(x.response.code!=404){throw x;}});
});
