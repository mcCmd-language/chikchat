document.getElementById("chat_send").addEventListener("mousedown", ()=>{
    const msg = document.getElementById("write_message");
    ipcRenderer.send("requestChatSend", msg.value);

    msg.value = "";
});

document.getElementById("write_message").addEventListener("keypress", (ev)=>{
    if (ev.key !== "Enter") return;
    const msg = document.getElementById("write_message");

    if (ev.shiftKey) {
        return;
    }
    ipcRenderer.send("requestChatSend", msg.value);

    msg.value = "";
    ev.returnValue = false;
});

document.getElementById("search").addEventListener("keyup", (ev)=>{
    const search = document.getElementById("search");
    updateUsers(Users.filter((v)=>v.name.includes(search.value)));
});

ipcRenderer.on("responseChatSend", (ev, arg1)=>{
    let response = IchatResponse;
    response = arg1;
});

const content = document.getElementById("chat_content");

function updateChatData(msgs_) {
    let msg = [
        {
            user: {},
            msg: "string",
        }
    ];
    msg = msgs_;

    content.innerHTML = "";

    msg.forEach((v)=>{
        
    });
}