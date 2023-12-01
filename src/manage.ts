import { ipcMain } from "electron";
import { win } from "./window";
import { User } from "./user";
import { MainData } from "./main";

/////////////// 구현 클래스 /////////////////
class ManageElement {
    constructor (
        public name: string,
    ) {}

    public type?: string;
    public value?: any;
}

class ToggleElement extends ManageElement {
    type = "toggle";
    value: boolean = false;
}

class InputElement extends ManageElement {
    type = "input";
    value: string = "";
}

class TimerElement extends ManageElement {
    type = "timer";
    value: number = 0;
}

class TriggerElement extends ManageElement {
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
    MainData.instance.users.splice(arg, 1);

    await updateManageData();

    ev.reply("responseRemoveManage", MainData.instance.myAccount?.manage);
});

///////////////// 데이터 관리 ///////////////////
async function updateManageData() {
    //myAccount.manage 데이터를 서버의 myAccount에 갱신

    return;
}
