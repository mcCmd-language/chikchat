import { ipcMain } from "electron";
import { win } from "./window";
import { User } from "./user";

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
        user: User,
    ) {
        user.manage.push(this);
    }
}

ipcMain.on("requestManageData", async (ev)=>{
    await win.loadFile("./html/manage/index.html");

    ev.reply("responseManageData");
});
