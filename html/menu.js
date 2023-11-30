const {ipcRenderer} = require("electron");

document.getElementById("home_button").addEventListener("mousedown", ()=>{
    ipcRenderer.send("requestHomeData");
});

ipcRenderer.on("responseHomeData", (ev, arg1)=>{
    let response = IchatResponse;
    response = arg1;
});

document.getElementById("chat_button").addEventListener("mousedown", ()=>{
    ipcRenderer.send("requestChatData");
});

ipcRenderer.on("responseChatData", (ev, arg1)=>{
    let response = IchatResponse;
    response = arg1;

    Users = response.users;
    updateUsers(response.users);
});

document.getElementById("minimize_window").addEventListener("mousedown", ()=>{
    console.log("minimize");
    ipcRenderer.send('minimizeApp');
});
document.getElementById("maximize_window").addEventListener("click", ()=>{
    ipcRenderer.send('maximizeApp');
});
document.getElementById("close_window").addEventListener("click", ()=>{
    ipcRenderer.send('closeApp');
});
