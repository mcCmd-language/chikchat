import { ipcMain } from "electron";
import { MainData } from "./main";
import { win } from "./window";
import { User } from "./user";
import { ChatData, api_url, message } from "./chat";
import axios from "axios";

ipcMain.on("login", async (ev, id, pw)=>{
    console.log("a");
    await axios.get(api_url + "/users").then((v)=>{
        const classList: User[] = [];
        v.data.forEach((element: any) => {
            classList.push(new User(element["username"],element["accid"],element["description"], undefined, element["image"]))
        });
        MainData.instance.users = classList;
    })
    console.log("b");
    const user = MainData.instance.users.find((v)=> v.id === id);

    if (!user) {
        ev.reply("responseLogin", "no_user");
        return;
    }

    await axios.get(api_url + "/login", {
        headers: {
            "accid": id,
            "password": pw
        }
    }).then(async (_)=>{
        MainData.instance.myAccount = user;

        await win.loadFile('./html/home/index.html');

        ev.reply("responseHomeData", MainData.instance.myAccount.decode());

        await axios.get(api_url + "/msgs").then((v)=>{
            const classList: message[] = [];
            v.data.forEach((element: any) => {
                let msg = "";
                try {
                    msg = decodeURI(element["text"]);
                } catch {
                    msg = element["text"];
                }
                const a = {
                    user: MainData.instance.users.filter((x)=>{return element["from"] == x.id})[0],
                    msg: msg,
                    time: element["time"],
                    sendTo: element["to"],
                    isMine: true
                };
                
                if (a.user) {
                    if (a.user.id != MainData.instance.myAccount?.id) {
                        a.isMine = false;
                    }
                    classList.push(a);
                }
            });
            ChatData.instance.messages = classList;
            console.log(ChatData.instance.messages);
        })
    }).catch((x)=>{
        if (x.response == undefined) {throw x;}
        if (x.response.status == 401) {
            ev.reply("responseLogin", "incorrect");
        } else {throw x;}
    })
});

ipcMain.on("register", async (ev, name, id, pw)=>{
    const user = new User(name, id, "", pw);

    let success = false;
    await axios.post(api_url + "/register", {}, {
        headers: {
            "username": user.encode().name,
            "accid": user.id,
            "password": user.pw,
            "description": user.description
        }
    }).then(async (x)=>{
        MainData.instance.addUser(user, false);
        await win.loadFile('./html/login/index.html');
        ev.reply("responseLogin", "register");
    }).catch((x)=>{
        console.log(x.response);
        if (x.response == undefined) {throw x;}
        if (x.response.status == 409) {
            ev.reply("responseRegister", "already_exist");
        } else { throw x; }
    })
});
