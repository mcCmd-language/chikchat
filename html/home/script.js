ipcRenderer.on("responseHomeData", (ev, arg1)=>{
    document.getElementById("username").innerHTML = arg1.name;
    document.getElementById("tag").innerHTML = "@" + arg1.id;
    document.getElementById("descrip").value = arg1.description;
});

const descrip = document.getElementById("descrip");

descrip.addEventListener("change", ()=>{
    ipcRenderer.send("changeDescrip", descrip.value);
});
