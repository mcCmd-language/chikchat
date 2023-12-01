import { ipcMain } from "electron";
import { win } from "./window";
import { User } from "./user";
import { MainData } from "./main";
import axios from "axios";
import { api_url } from "./chat";

export class ManageElement {
    constructor (
        public name: string,
    ) {}

    public type?: string;
    public value?: any;
}

export class ToggleElement extends ManageElement {
    type = "toggle";
    value: boolean = false;
}

export class InputElement extends ManageElement {
    type = "input";
    value: string = "";
}

export class TimerElement extends ManageElement {
    type = "timer";
    value: number = 0;
}

export class TriggerElement extends ManageElement {
    type = "trigger";
    value = "actionType";
}

export class Manage {
    readonly elements: ManageElement[] = [];

    constructor(
        public name: string,
        user: User,
    ) {
        user.manage.push(this);
    }
}

///////////////// ELECTRON 통신 ///////////////////////

ipcMain.on("requestManageData", async (ev)=>{
    await win.loadFile("./html/manage/index.html");

    ev.reply("responseManageData", MainData.instance.myAccount?.manage);
});

ipcMain.on("request_addManage", async (ev, arg)=>{
    new Manage(encodeURI(arg), MainData.instance.myAccount!);

    await updateManageData();

    ev.reply("responseAddManage", MainData.instance.myAccount?.manage);
});

ipcMain.on("requestRemoveManage", async (ev, arg)=>{
    MainData.instance.myAccount?.manage.splice(arg, 1);

    await updateManageData();

    ev.reply("responseRemoveManage", MainData.instance.myAccount?.manage);
});

///////////////// 데이터 관리 ///////////////////
async function updateManageData() {
    const myAccountstr = MainData.instance.myAccount?.manage;
    if (myAccountstr === null) {
        throw TypeError()
    }
    console.warn(JSON.stringify(myAccountstr))
    await axios.post(api_url + "/update_manage", {}, {headers: {
        accid: MainData.instance.myAccount?.name,
        manage: JSON.stringify(myAccountstr)
    }});

    return;
}
