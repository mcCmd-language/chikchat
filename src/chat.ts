import { ipcMain } from "electron";
import { User } from "./user";
import { MainData } from "./main";
import { win } from "./window";
import axios from "axios";
import * as log from "electron-log"; 
import { error } from "console";

const URL = "http://0.0.0.0:21000";

interface message {
    user: User;
    msg: string;
    isMine: boolean;
    time: number;
}

class ChatData {
    public static instance = new ChatData();

    messages: message[] = [];
}

ChatData.instance.messages.push(
    {
        user: MainData.instance.users[0],
        msg: "test yeee",
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

ipcMain.on("requestChatData", async (ev)=>{
    await win.loadFile("./html/chat/index.html");
    ev.reply("responseChatData", {
        users: MainData.instance.users,
        messages: ChatData.instance.messages,
    });
});

ipcMain.on("requestChatSend", async (ev, arg1)=>{
    ChatData.instance.messages.push(
        {
            user: MainData.instance.myAccount!,
            msg: arg1,
            isMine: true,
            time: Date.now(),
        },
    );

    log.info(`data: ${JSON.stringify(MainData.instance.myAccount)}, ${arg1}`);
    await axios.post(`${URL}/msg`, {}, {
                    headers: {from: MainData.instance.myAccount!.name,
                    to: "b",
                    content: arg1}
    })

    ev.reply("responseChatSend", {
        messages: ChatData.instance.messages,
    });
});
