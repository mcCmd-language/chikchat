let chatData = [];
ipcRenderer.on("responseChatData", (ev, arg1)=>{
    let response = IchatResponse;
    response = arg1;

    updateChatData(response.messages);
});

document.getElementById("chat_send").addEventListener("mousedown", ()=>{
    const msg = document.getElementById("write_message");

    if (msg.value.length < 1) return;

    ipcRenderer.send("requestChatSend", msg.value);

    msg.value = "";
});

document.getElementById("write_message").addEventListener("keypress", (ev)=>{
    if (ev.key !== "Enter") return;
    const msg = document.getElementById("write_message");

    if (msg.value.length < 1) {
        ev.returnValue = false;
        return;
    }

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

    updateChatData(response.messages);

    content.scrollTo(0, content.scrollHeight);
});

const content = document.getElementById("chat_content");

function updateChatData(msgs_) {
    let msg = [
        {
            user: {},
            msg: "string",
            isMine: false,
            time: 0,
        },
    ];
    msg = msgs_;

    content.innerHTML = "";

    let showProfile = true;
    let lastResTime = 0;

    msg.forEach((v, i)=>{
        const text = document.createElement("p");
        text.className = "text";

        const message = document.createElement("div");
        message.className = "message";

        content.appendChild(message);
        if (v.isMine) {
            showProfile = true;
            message.className += " text-only";

            const response = document.createElement("div");
            response.className = "response";

            response.appendChild(text);
            message.appendChild(response);

            if (v.time - lastResTime > 60000) {
                if (msg[i + 1]?.isMine !== true) {
                    const time = document.createElement("p");
                    time.className = "response-time time";
                    
                    content.appendChild(time);

                    const t = new Date(v.time);

                    const minN = t.getMinutes();

                    let min = `${minN}`;
                    if (minN < 10) min = `0${minN}`;

                    time.innerHTML = `${t.getHours()}:${min}`;

                    lastResTime = v.time;
                }
            }
        } else {
            if (showProfile) {
                const photo = document.createElement("div");
                photo.className = "photo";
                photo.style.backgroundImage = 
                "url(https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80)";

                message.appendChild(photo);
                
                const name = document.createElement("b");
                name.className = "name";
                
                message.appendChild(name);
                message.appendChild(text);

                name.innerHTML = v.user.name;

                text.className += "_name";

                showProfile = false;
            } else {
                message.className += " text-only";

                message.appendChild(text);
            }
        }

        text.innerHTML = v.msg;
    });
}