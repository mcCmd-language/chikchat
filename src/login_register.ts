import { ipcMain } from "electron";
import { MainData } from "./main";
import { win } from "./window";
import { User } from "./user";

ipcMain.on("login", async (ev, id, pw)=>{
    const user = MainData.instance.users.find((v)=> v.id === id);

    if (!user) {
        ev.reply("responseLogin", "no_user");
        return;
    }

    if (user.pw === pw) {
        MainData.instance.myAccount = user;

        await win.loadFile('./html/home/index.html');

        ev.reply("responseHomeData", MainData.instance.myAccount);
    } else {
        ev.reply("responseLogin", "incorrect");
    }
});

ipcMain.on("register", async (ev, name, id, pw)=>{
    const user_ = MainData.instance.users.find((v)=> v.id === id);

    if (user_) {
        ev.reply("responseRegister", "already_exist");
        return;
    }

    const user = new User(name, id, "", pw);
    
    MainData.instance.addUser(user, false);

    await win.loadFile('./html/login/index.html');
    ev.reply("responseLogin", "register");
});
