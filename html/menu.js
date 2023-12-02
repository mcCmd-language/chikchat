document.getElementById("home_button").addEventListener("mousedown", ()=>{
    ipcRenderer.send("requestHomeData");
});

document.getElementById("manage_button").addEventListener("mousedown", ()=>{
    ipcRenderer.send("requestManageData");
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

document.getElementById("search_user_button").addEventListener("mousedown", ()=>{
    location.href = "../404/index.html";
});

document.getElementById("setting_button").addEventListener("mousedown", ()=>{
    location.href = "../404/index.html";
});
