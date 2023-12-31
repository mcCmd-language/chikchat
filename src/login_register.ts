import { ipcMain } from "electron";
import { MainData } from "./main";
import { win } from "./window";
import { User } from "./user";
import { ChatData, api_url, message } from "./chat";
import axios from "axios";
import { InputElement, Manage, ManageElement, TimerElement, ToggleElement, TriggerElement } from "./manage";
import { createTray } from "./tray";

export async function getUsers(callback: (data: User[])=>void) {
    await axios.get(api_url + "/users").then((v)=>{
        console.log(JSON.stringify(v.data));
        const classList: User[] = [];
        v.data.forEach((element: any) => {
            const user = new User(element["username"],element["accid"],element["description"], undefined, element["image"], [])
            console.log(element["manage"]);
            element["manage"].forEach((element2: any) => {
                const m = new Manage(element2["name"], user);
                element2["elements"].forEach((element2: any) => {
                    let me: ManageElement;
                    switch (element2["type"]) {
                        case "input":
                            me = new InputElement(element2["name"]); break;
                        case "toggle":
                            me = new ToggleElement(element2["name"]); break;
                        case "timer":
                            me = new TimerElement(element2["name"]); break;
                        case "trigger":
                            me = new TriggerElement(element2["name"]); break;
                        default:
                            me = new ManageElement(element2["name"]);
                            me.type = element2["type"];
                            me.value = element2["value"];
                    }
                    me.type = element2["type"]
                    me.value = element2["value"]
                    m.elements.push(me);
                });
            });
            classList.push(user);
        });
        callback(classList);
    })
}

//로그인
ipcMain.on("login", async (ev, id, pw)=>{
    await getUsers((d)=>{console.log(d);MainData.instance.users = d;})
    const user = MainData.instance.users.find((v)=> v.id === id);

    if (!user) {
        ev.reply("responseLogin", "no_user");
        return;
    }

    await axios.get(api_url + "/login", {
        headers: {
            "accid": id,
            "password": pw,
        }
    }).then(async ()=>{
        MainData.instance.myAccount = user;

        await win.loadFile('./html/home/index.html');

        createTray();

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
                console.log("b");
                
                if (a.user) {
                    if (a.user.id != MainData.instance.myAccount?.id) {
                        a.isMine = false;
                    }
                    classList.push(a);
                }
            });
            ChatData.instance.messages = classList;
            console.log(ChatData.instance.messages);
        });
    }).catch((x)=>{
        console.log(x);
        if (x.response == undefined) {throw x;}
        if (x.response.status == 401) {
            ev.reply("responseLogin", "incorrect");
        } else {throw x;}
    })
});

ipcMain.on("register", async (ev, name, id, pw)=>{
    const user = new User(name, id, "", pw);

    await axios.post(api_url + "/register", {}, {
        headers: {
            "username": user.encode().name,
            "accid": user.id,
            "password": user.pw,
            "description": user.description
        }
    }).then(async ()=>{
        MainData.instance.addUser(user, false);
        await win.loadFile('./html/login/index.html');
        ev.reply("responseLogin", "register");
    }).catch((x)=>{
        if (x.response == undefined) {throw x;}
        if (x.response.status == 409) {
            ev.reply("responseRegister", "already_exist");
        } else { throw x; }
    })
});
