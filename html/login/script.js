document.getElementById("register").addEventListener("click", ()=>{
    document.location.href = "../register/index.html";
});
/**
 * 
 * @param {String} str
 */
function throwError(str) {
    const err = document.getElementById("onError");

    err.style.backgroundColor = "red";

    err.innerHTML = str;
    err.style.display = "block";
}

function clearError() {
    const err = document.getElementById("onError");
    
    err.style.display = "none";
}
/**
 * 
 * @param {String} str
 */
function Success(str) {
    const err = document.getElementById("onError");

    err.style.backgroundColor = "green";

    err.innerHTML = str;
    err.style.display = "block";
}

document.getElementById("login-form").addEventListener("submit", (ev)=>{
    ev.preventDefault();

    const id = document.querySelector("input[name=id]").value;
    const pw = document.querySelector("input[name=pw]").value;

    if (id.length < 1) {
        throwError("id 왜 안적음");

        return;
    }

    if (pw.length < 1) {
        throwError("비번 왜 안적음");

        return;
    }

    clearError();

    ipcRenderer.send("login", id, pw);
});

ipcRenderer.on("responseLogin", (ev, answer)=>{
    if (answer === "no_user") {
        throwError("해당 id의 계정이 없습니다.");
    }
    else if (answer === "incorrect") {
        throwError("비밀번호가 틀렸습니다!");
    }
    else if (answer === "register") {
        Success("회원가입을 성공했습니다!");
    }
    else {
        throwError("Unknown error: 404");
    }
});
