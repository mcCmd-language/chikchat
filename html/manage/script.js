////////////////////// HTML 이벤트 //////////////////////////
document.getElementById("add_manage").addEventListener("click", ()=>{
    document.getElementById("add_manage_value").value = "";
    document.querySelector('.modal').style.display = "block";
});

document.getElementById("add_manage_false").addEventListener("click", ()=>{
    document.querySelector('.modal').style.display = "none";
});

document.getElementById("add_manage_true").addEventListener("click", ()=>{
    const value = document.getElementById("add_manage_value").value;

    ipcRenderer.send("request_addManage", value);
    document.querySelector('.modal').style.display = "none";
});

////////////////////// ELECTRON 통신 //////////////////////////
ipcRenderer.on("responseAddManage", (ev, arg)=>{
    let response = [
        IManage,
    ];
    response = arg;

    updateManage(response);
});

ipcRenderer.on("responseRemoveManage", (ev, arg)=>{
    let response = [
        IManage,
    ];
    response = arg;

    updateManage(response);
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
    let manages = [
        IManage,
    ];
    manages = manages_;

    manages.forEach((v, i)=>{
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
            ipcRenderer.send("requestRemoveManage", i);
        });

        discuss.addEventListener("click", ()=>{
            if (deleted) return;
            updateManageElement(v.elements);

            document.getElementById("calName").innerHTML = name_;
        });
    });
}

/**
 * 일정의 요소들을 html로 렌더링합니다.
 * @param {Array} elements_ 일정의 요소 데이터
 */
function updateManageElement(elements_) {
    let elements = [IManageElement];
    elements = elements_;

    elements.forEach((v)=>{
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