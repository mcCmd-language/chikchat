document.getElementById("login").addEventListener("click", ()=>{
    document.location.href = "../login/index.html";
});
/**
 * 
 * @param {String} str
 */
function throwError(str) {
    const err = document.getElementById("onError");

    err.innerHTML = str;
    err.style.display = "block";
}

function clearError() {
    const err = document.getElementById("onError");

    err.style.display = "none";
}

document.getElementById("login-form").addEventListener("submit", (ev)=>{
    ev.preventDefault();

    const name = document.querySelector("input[name=name]").value;
    const id = document.querySelector("input[name=id]").value;
    const pw = document.querySelector("input[name=pw]").value;

    if (id.length < 1) {
        throwError("이름을 적으세요!");

        return;
    }

    if (id.length < 1) {
        throwError("id를 적으세요!");

        return;
    }

    if (pw.length < 1) {
        throwError("비밀번호를 적으세요!");

        return;
    }

    const reg = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;

    if (pw.match(reg) === null) {
        throwError("비밀번호 규칙을 위반했습니다! rule: 8~15 자, 하나 이상의 문자, 하나의 숫자 및 하나의 특수 문자");

        return;
    }

    clearError();

    ipcRenderer.send("register", name, id, pw);
});

ipcRenderer.on("responseRegister", (ev, answer)=>{
    if (answer === "already_exist") {
        throwError("이미 존재하는 계정의 id입니다.");
    }
    else {
        throwError("Unknown error: 414");
    }
});
