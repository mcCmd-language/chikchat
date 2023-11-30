let chatData = [];
let selected = null;
let myAccount = null;

ipcRenderer.on("responseChatData", (ev, arg1, my)=>{
    let response = IchatResponse;
    response = arg1;

    Users = response.users;
    chatData = response.messages;

    myAccount = my;

    updateUsers(response.users);
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
    ipcRenderer.send("requestChatSend", msg.value, selected);

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

    chatData = response.messages;
    updateChatData(response.messages);

    content.scrollTo(0, content.scrollHeight);
});


const content = document.getElementById("chat_content");
const connectedUsers = document.getElementById("connected_users");


function updateChatData(msgs_) {
    content.innerHTML = "";
    if (selected === null) {
        document.getElementById("footer").style.display = "none";
        return;
    }
    document.getElementById("footer").style.display = "block";

    let msg = [
        {
            user: Iuser,
            msg: "string",
            isMine: false,
            time: 0,
            sendTo: "string",
        },
    ];
    msg = msgs_.filter((v)=>(v.user.id === selected && !v.isMine) || (v.isMine && v.sendTo === selected));

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

                //message.className += " text-only";

                text.className = "text_name";
                
                message.appendChild(name);
                message.appendChild(text);

                name.innerHTML = v.user.name;

                showProfile = false;
            } else {
                message.className += " text-only";

                message.appendChild(text);
            }
        }

        text.innerHTML = v.msg;
    });
}

function updateUsers(users_) {
    let users = [Iuser];
    users = users_;

    connectedUsers.innerHTML = "";

    users.filter((v)=>v.id !== myAccount).forEach((v)=>{
        const tag = document.createElement("div");
        tag.className = "discussion";

        tag.addEventListener("click", (ev)=>{
            selected = v.id;
            document.getElementById("chatName").innerHTML = v.name;

            updateChatData(chatData);
        });
        
        //프로필 사진
        const photo = document.createElement("div");
        photo.className = "photo";
        photo.style.backgroundImage = "url(https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80)";

        tag.appendChild(photo);

        //이름과 소개정보
        const contact = document.createElement("div");
        contact.className = "desc-contact";

        const name = document.createElement("p");
        name.className = "name";
        contact.appendChild(name);

        const desc = document.createElement("p");
        desc.className = "message";
        contact.appendChild(desc);

        tag.appendChild(contact);

        //console.log(contact);

        connectedUsers.appendChild(tag);

        name.innerText = v.name;
        desc.innerHTML = v.description;
    });
}

//interface
const Iuser = {
    name: "string",
    id: "string",
    description: "string",
};

let Users = [Iuser];

const Imessage = {
    user: Iuser,
    msg: "string",
};

const IchatResponse = {
    users: [
        Iuser
    ],
    messages: [
        Imessage,
    ],
};
