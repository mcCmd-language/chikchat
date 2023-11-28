import { ipcMain } from "electron";
import { User } from "./user";
import { MainData } from "./main";
import { win } from "./window";
import axios from "axios";

const URL = "http://localhost:21000";

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
        users: MainData.instance.users,
        messages: ChatData.instance.messages,
    });
});

ipcMain.on("requestChatSend", async (ev, arg1, arg2)=>{
    ChatData.instance.messages.push(
        {
            user: MainData.instance.myAccount!,
            msg: arg1,
            isMine: true,
            sendTo: arg2,
            time: Date.now(),
        },
    );

    await axios.post(URL + "/msg", {
        headers: {
            from: MainData.instance.myAccount!.name,
            to: arg2,
            content: arg1,
        }
    });

    ev.reply("responseChatSend", {
        messages: ChatData.instance.messages,
    });
});
