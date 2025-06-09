const socket = io();
const textarea = document.getElementById("editor");

textarea.addEventListener("input", () => {
  socket.emit("text-update", textarea.value);
});

socket.on("text-update", (newText) => {
  if (textarea.value !== newText) {
    textarea.value = newText;
  }
});
