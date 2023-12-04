////////////////////// HTML 이벤트 //////////////////////////
let manages = [];
let selected = -1;

document.getElementById("add_manage").addEventListener("click", ()=>{
    document.getElementById("add_manage_value").value = "";
    document.querySelector('.modal').style.display = "block";
});

document.getElementById("add_manage_false").addEventListener("click", ()=>{
    document.querySelector('.modal').style.display = "none";
});

document.getElementById("add_manage_true").addEventListener("click", ()=>{
    const value = document.getElementById("add_manage_value").value;

    if (value.length < 1) value = "새 일정";

    ipcRenderer.send("request_addManage", value);
    document.querySelector('.modal').style.display = "none";
});

document.getElementById("search").addEventListener("keyup", (ev)=>{
    const search = document.getElementById("search");
    updateManage(manages.filter((v)=>v.name.includes(search.value)));
});

document.getElementById("write_message").addEventListener("keypress", (ev)=>{
    if (ev.key !== "Enter") return;

    const value = document.getElementById("write_message").value;

    const option = document.getElementById("manage_option").value;

    if (value.trim().length < 1) {
        ev.returnValue = false;

        return;
    }

    ipcRenderer.send("add_manageElement", option, encodeURI(value), selected);

    document.getElementById("write_message").value = "";
});

document.getElementById("add_element").addEventListener("click", ()=>{
    const value = document.getElementById("write_message").value;

    const option = document.getElementById("manage_option").value;

    if (value.trim().length < 1) {
        ev.returnValue = false;

        return;
    }

    ipcRenderer.send("add_manageElement", option, encodeURI(value), selected);

    document.getElementById("write_message").value = "";
});

////////////////////// ELECTRON 통신 //////////////////////////
ipcRenderer.on("responseManageData", (ev, arg)=>{
    let response = [
        IManage,
    ];
    response = arg;

    manages = response;

    updateManage(response);
    content.innerHTML = "";
});

ipcRenderer.on("responseAddManage", (ev, arg)=>{
    let response = [
        IManage,
    ];
    response = arg;

    manages = response;

    updateManage(response);
});

ipcRenderer.on("responseRemoveManage", (ev, arg)=>{
    let response = [
        IManage,
    ];
    response = arg;

    manages = response;

    updateManage(response);
});

ipcRenderer.on("responseElement", (ev, arg)=>{
    let response = [
        IManage,
    ];
    response = arg;

    manages = response;

    updateManageElement(manages[selected].elements);
});

////////////////////// HTML 렌더링 //////////////////////////

const section = document.getElementById("manages");
const content = document.getElementById("content");

/**
 * 일정들을 html로 렌더링합니다.
 * @param {Array} manages_ 일정의 요소 데이터
 */
function updateManage(manages_) {
    section.innerHTML = "";
    let manage = [
        IManage,
    ];
    manage = manages_;

    manage.forEach((v, i)=>{
        const discuss = document.createElement("div");
        discuss.className = "discussion clickable";

        section.appendChild(discuss);

        const icon = document.createElement("i");
        icon.className = "fa-solid fa-calendar-days fa-xl";

        discuss.appendChild(icon);

        const name = document.createElement("b");
        discuss.appendChild(name);

        let name_ = "";
        try {
            name_ = decodeURI(v.name);
        } catch {
            name_ = v.name;
        }

        name.innerHTML = name_;

        const btn = document.createElement("button");
        btn.className = "btn-default clickable";

        discuss.appendChild(btn);
        btn.innerHTML = "삭제";

        let deleted = false;

        btn.addEventListener("click", ()=>{
            deleted = true;

            if (i === selected) {
                selected = -1;

                updateManageElement([]);
                document.getElementById("calName").innerHTML = "일정 정보";
            }
            ipcRenderer.send("requestRemoveManage", i);
        });

        discuss.addEventListener("click", ()=>{
            if (deleted) return;

            selected = i;
            updateManageElement(manages[selected].elements);

            document.getElementById("calName").innerHTML = name_;
        });
    });
}

/**
 * 일정의 요소들을 html로 렌더링합니다.
 * @param {Array} elements_ 일정의 요소 데이터
 */
function updateManageElement(elements_) {
    content.innerHTML = "";
    let elements = [IManageElement];
    elements = elements_;

    elements.forEach((v, i)=>{
        const elem = document.createElement("div");
        elem.className = "manage_element";

        content.appendChild(elem);

        let toggle, note;

        if (v.type === "toggle") {
            elem.className += " toggle_elem";
            toggle = document.createElement("input");
            toggle.type = "checkbox";

            elem.appendChild(toggle);

            elem.innerHTML += ` ${decodeURI(v.name)}`;

            elem.querySelector("input").checked = v.value;

            elem.querySelector("input").addEventListener("change", ()=>{
                toggle.checked = !toggle.checked;
                ipcRenderer.send("changeManage", selected, i, "toggle", toggle.checked);
            });
        }
        else if (v.type === "input") {
            elem.className += " note";
            const name = document.createElement("a");
            elem.appendChild(name);
            name.innerHTML = `${decodeURI(v.name)}: `;

            note = document.createElement("textarea");
            elem.appendChild(note);
            
            elem.querySelector("textarea").value = decodeURI(v.value);

            elem.querySelector("textarea").addEventListener("change", ()=>{
                ipcRenderer.send("changeManage", selected, i, "input", encodeURI(note.value));
            });
        }
        else if (v.type === "header") {
            elem.className += " header_elem";

            const header = document.createElement("b");
            elem.appendChild(header);

            header.innerHTML = `--  ${decodeURI(v.name)}  --`;
        }

        const remove = document.createElement("button");
        remove.className = "btn-default";

        elem.appendChild(remove);
        remove.innerHTML = "삭제";

        content.appendChild(document.createElement("br"));

        remove.addEventListener("click", ()=>{
            ipcRenderer.send("removeManageElement", selected, i);
        });
    });
}

//////////////////// js를 타입스크립트처럼..! ////////////////////////
const IManageElement = {
    type: "string",
    value: ["string", 0, true],
};

const IManage = {
    name: "string",
    elements: [IManageElement],
};
