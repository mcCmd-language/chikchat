const {ipcRenderer} = require("electron");

const connectedUsers = document.getElementById("connected_users");

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

function updateUsers(users_) {
    let users = [Iuser];
    users = users_;

    connectedUsers.innerHTML = "";

    users.forEach((v)=>{
        const tag = document.createElement("div");
        tag.className = "discussion";
        
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