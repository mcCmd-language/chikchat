document.getElementById("home_button").addEventListener("mousedown", ()=>{
    ipcRenderer.send("requestHomeData");
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
