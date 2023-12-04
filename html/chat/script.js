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

    ipcRenderer.send("requestChatSend", {
        msg: msg.value,
        selected: selected,
    });

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
    console.log(msg.value);
    console.log(selected);
    ipcRenderer.send("requestChatSend", {
        msg: msg.value,
        selected: selected,
    });

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

//문자열에 링크를 자동으로 하이퍼링크로 변환
function linkify(inputText) {
    let replacedText, replacePattern1, replacePattern2, replacePattern3;

    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

    return replacedText;
}

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
    msg = msgs_.filter((v)=>(v.user?.id === selected && !v.isMine) || (v.isMine && v.sendTo === selected));

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
                "url(https://cdn2.vectorstock.com/i/1000x1000/17/16/default-avatar-anime-girl-profile-icon-vector-21171716.jpg)";

                message.appendChild(photo);
                
                const name = document.createElement("b");
                name.className = "name";

                //message.className += " text-only";

                text.className = "text_name";
                
                message.appendChild(name);
                message.appendChild(text);

                let username = "";

                try {
                    username = decodeURI(v.user.name);
                } catch {
                    username = v.user.name;
                }

                name.innerHTML = username;

                showProfile = false;
            } else {
                message.className += " text-only";

                message.appendChild(text);
            }
        }

        let msg_ = "";

        try {
            msg_ = decodeURI(v.msg);
        } catch {
            msg_ = v.msg;
        }

        text.innerHTML = linkify(msg_)  ;
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

            content.scrollTo(0, content.scrollHeight);

            ipcRenderer.send("selectUserchat", selected);
        });
        
        //프로필 사진
        const photo = document.createElement("div");
        photo.className = "photo";
        photo.style.backgroundImage = "url(https://cdn2.vectorstock.com/i/1000x1000/17/16/default-avatar-anime-girl-profile-icon-vector-21171716.jpg)";

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
