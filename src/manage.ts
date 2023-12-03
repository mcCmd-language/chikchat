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

    ev.reply("responseAddManage", MainData.instance.myAccount?.manage);

    await updateManageData();
});

ipcMain.on("requestRemoveManage", async (ev, arg)=>{
    MainData.instance.myAccount?.manage.splice(arg, 1);

    ev.reply("responseRemoveManage", MainData.instance.myAccount?.manage);

    await updateManageData();
});

ipcMain.on("add_manageElement", async (ev, option, name, i)=>{
    if (option === "toggle") {
        MainData.instance.myAccount?.manage[i]
            .elements.push(
            new ToggleElement(name),
        );
    }
    else if (option === "input") {
        MainData.instance.myAccount?.manage[i]
        .elements.push(
            new InputElement(name),
        );
    }
    else if (option === "timer") {
        MainData.instance.myAccount?.manage[i]
        .elements.push(
            new TimerElement(name),
        );
    }
    else if (option === "trigger") {
        MainData.instance.myAccount?.manage[i]
        .elements.push(
            new TriggerElement(name),
        );
    }
    else if (option === "header") {
        const elem = new ManageElement(name);
        elem.type = "header";
        elem.value = name;
        
        MainData.instance.myAccount?.manage[i]
        .elements.push(
            elem,
        );
    }

    ev.reply("responseElement", MainData.instance.myAccount?.manage);

    await updateManageData();
});

ipcMain.on("changeManage", async (ev, selected, index, type, value)=>{
    console.log(type + " " + value);
    if (!MainData.instance.myAccount) return;

    if (type === "toggle") {
        MainData.instance.myAccount.manage[selected].elements[index].value = value;
    }
    else if (type === "input") {
        MainData.instance.myAccount.manage[selected].elements[index].value = value;
    }

    ev.reply("responseElement", MainData.instance.myAccount?.manage);

    await updateManageData();
});

ipcMain.on("removeManageElement", async (ev, selected, index)=>{
    if (!MainData.instance.myAccount) return;

    MainData.instance.myAccount.manage[selected].elements.splice(index, 1);

    ev.reply("responseElement", MainData.instance.myAccount?.manage);

    await updateManageData();
});

///////////////// 데이터 관리 ///////////////////
async function updateManageData() {
    const myAccountstr = MainData.instance.myAccount?.manage;
    if (myAccountstr === null) {
        throw TypeError();
    }
    console.warn(JSON.stringify(myAccountstr));

    await axios.post(api_url + "/update_manage", {}, {headers: {
        accid: MainData.instance.myAccount?.id,
        manage: JSON.stringify(myAccountstr),
    }});

    return;
}
