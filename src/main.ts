import { ipcMain } from "electron";
import { User } from "./user";
import { win } from "./window";
import axios from "axios";
import { api_url } from "./chat";

export class MainData {
    public static instance: MainData = new MainData();

    public users: User[] = [];
    public myAccount?: User;

    addUser(obj: User, isMine: boolean): void;
    addUser(name: string, id:string, description?: string, pw?: string, isMine?: boolean): void;
    addUser(obj_name: string | User, id_mine?:string | boolean, description = "", pw?: string, isMine = false): void {
      if (obj_name instanceof User) {
        if (id_mine) {
          this.myAccount = obj_name;
        }
        this.users.push(obj_name);

        return;
      } else {
        const obj = new User(obj_name, id_mine as string, description, pw);

        if (isMine) {
            this.myAccount = obj;
        }
        this.users.push(obj);
      }
    }
}

ipcMain.on("requestHomeData", async (ev)=>{
    await win.loadFile("./html/home/index.html");
    ev.reply("responseHomeData", MainData.instance.myAccount);
});

ipcMain.on("changeDescrip", async (ev, arg)=>{
  if (!MainData.instance.myAccount) return;

  MainData.instance.myAccount.description = arg;

  await axios.post(api_url + "/update_desc", {}, {
    headers: {
      "accid": MainData.instance.myAccount.id,
      "description": MainData.instance.myAccount.description
    }
  })
});

ipcMain.on('minimizeApp', ()=>{
    win.minimize();
  });

ipcMain.on('maximizeApp', (ev)=>{
  if(win.isMaximized()){
    win.restore();

    ev.reply("after_maximize", false);
  } else {
    win.maximize();

    ev.reply("after_maximize", true);
  }
});

ipcMain.on('closeApp', ()=>{
  win.close();
});