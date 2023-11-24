import { ipcMain } from "electron";
import { User } from "./user";
import { win } from "./window";

export class MainData {
    public static instance: MainData = new MainData();

    public users: User[] = [];
    public myAccount?: User;

    addUser(name: string, description = "", isMine = false): void {
        const obj = new User(name, description);

        if (isMine) {
            this.users.unshift(obj);

            this.myAccount = obj;
        } else {
            this.users.push(obj);
        }
    }
}

ipcMain.on("requestHomeData", async (ev)=>{
    await win.loadFile("./html/home/index.html");
    ev.reply("responseHomeData", {
        users: MainData.instance.users,
    });
});

MainData.instance.addUser("watashi");
MainData.instance.addUser("ny64");
MainData.instance.addUser("misilelab");
MainData.instance.addUser("minyee2913", "ㅋㅋㅋㅋㅋ", true);
