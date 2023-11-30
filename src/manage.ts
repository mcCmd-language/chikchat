import { ipcMain } from "electron";
import { win } from "./window";
import { User } from "./user";

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
        user: User,
    ) {
        user.manage.push(this);
    }
}

ipcMain.on("requestManageData", async (ev)=>{
    await win.loadFile("./html/manage/index.html");

    ev.reply("responseManageData");
});
