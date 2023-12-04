import { Menu, Tray, app, nativeImage } from "electron";
import path from "path";
import { MainData } from "./main";
import { win } from "./window";

export function createTray() {
    const icon = path.join(__dirname, "../icon.png");
    const iconImg = nativeImage.createFromPath(icon);

    if (MainData.instance.tray) MainData.instance.tray.destroy();
    MainData.instance.tray = new Tray(iconImg.resize({width: 16}));

    let contextArr = [
        {
            label: "열기",
            click: ()=>{
                win.show();
            }
        },
        {
            label: "로그아웃",
            click: async ()=>{
                win.show();
                MainData.instance.myAccount = undefined;
                await win.loadFile("./html/login/index.html");
            }
        },
        {
            label: "종료",
            click: ()=>{
                win.close();
            }
        }
    ];

    if (MainData.instance.myAccount === undefined) {
        contextArr.splice(1, 1);
    }

    const context = Menu.buildFromTemplate(contextArr);

    MainData.instance.tray.setContextMenu(context);

}
