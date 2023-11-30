import { ipcMain } from "electron";
import { MainData } from "./main";
import { win } from "./window";
import { User } from "./user";

ipcMain.on("login", async (ev, id, pw)=>{
    const user = MainData.instance.users.find((v)=> v.id === id); //서버에서 받아오는거로 변경

    if (!user) {
        ev.reply("responseLogin", "no_user");
        return;
    }

    if (user.pw === pw) {
        MainData.instance.myAccount = user;

        await win.loadFile('./html/home/index.html');

        ev.reply("responseHomeData", MainData.instance.myAccount);

        //서버에서 유저들 받아와서 MainData.instance.users 다시 할당
        //서버에서 채팅 기록 받아와서 ChatData.instance.messages 다시 할당
    } else {
        ev.reply("responseLogin", "incorrect");
    }
});

ipcMain.on("register", async (ev, name, id, pw)=>{
    const user_ = MainData.instance.users.find((v)=> v.id === id); //서버에서 비교하는거로 변경

    if (user_) {
        ev.reply("responseRegister", "already_exist");
        return;
    }

    const user = new User(name, id, "", pw);
    
    MainData.instance.addUser(user, false);
    //새로운 유저 서버에 할당

    await win.loadFile('./html/login/index.html');
    ev.reply("responseLogin", "register");
});
