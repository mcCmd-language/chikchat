import { ipcMain } from "electron";
import { User } from "./user";
import { MainData } from "./main";
import { win } from "./window";
import axios from "axios";
import { escape } from "querystring";

const URL = "https://backend.misilelaboratory.xyz";

interface message {
    user: User;
    msg: string;
    isMine: boolean;
    sendTo?: string;
    time: number;
}

class ChatData {
    public static instance = new ChatData();

    messages: message[] = [];
    selected?: User;
}

ChatData.instance.messages.push(
    {
        user: MainData.instance.users[0],
        msg: "으하하하하ㅏㅏㄱ",
        isMine: false,
        time: Date.now(),
    }
);
ChatData.instance.messages.push(
    {
        user: MainData.instance.users[0],
        msg: "으하하하하ㅏㅏㄱ",
        isMine: false,
        time: Date.now(),
    }
);
ChatData.instance.messages.push(
    {
        user: MainData.instance.users[1],
        msg: "썅뇨나",
        isMine: false,
        time: Date.now(),
    }
);

ipcMain.on("requestChatData", async (ev)=>{
    await win.loadFile("./html/chat/index.html");
    ev.reply("responseChatData", {
        users: MainData.instance.users.map((v)=>v.withoutPw()),
        messages: ChatData.instance.messages,
    }, MainData.instance.myAccount!.id);
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

    await axios.post(`${URL}/msg`, {}, 
    JSON.parse(JSON.stringify(
        {
            headers: {
                from: MainData.instance.myAccount.encode().id,
                to: escape(arg2),
                content: escape(arg1),
            }
        }
    )),
    );
});
