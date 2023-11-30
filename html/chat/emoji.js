const picker = document.getElementById("picker");

picker.addEventListener('emoji-click', event => {
    document.getElementById("write_message").value += event.detail.emoji.unicode;
});

  document.getElementById("emoji").addEventListener("click", ()=>{
    if (picker.style.display === "none") {
        picker.style.display = "block";
    } else {
        picker.style.display = "none";
    }
  });