const {ipcRenderer} = require("electron");

document.getElementById("minimize_window").addEventListener("click", ()=>{
    ipcRenderer.send('minimizeApp');
});

document.getElementById("maximize_window").addEventListener("click", ()=>{
    ipcRenderer.send('maximizeApp');
});

ipcRenderer.on("after_maximize", (ev, arg1)=>{
    const button = document.getElementById("maximize_window");
    
    if (arg1) {
        button.className = "fa-solid fa-square-caret-down fa-lg window";
    } else {
        button.className = "fa-solid fa-square-caret-up fa-lg window";
    }
});

document.getElementById("close_window").addEventListener("click", ()=>{
    ipcRenderer.send('closeApp');
});

ipcRenderer.on("notification", (ev, id, title, body)=>{
    const noti = new Notification(title, {
        body: body,
    });

    noti.addEventListener("click", ()=>{
        ipcRenderer.send("responseNoti", id);
    });
    
});

