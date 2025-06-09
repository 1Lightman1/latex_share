const socket = io();
const textarea = document.getElementById("editor");
const preview = document.getElementById("preview");

function updatePreview() {
  axios.post('/compile', { latex: textarea.value })
    .then(res => {
      preview.src = '/output/output.pdf?t=' + new Date().getTime();
    }).catch(err => console.error(err));
}

textarea.addEventListener("input", () => {
  socket.emit("text-update", textarea.value);
  updatePreview();
});

socket.on("text-update", (newText) => {
  if (textarea.value !== newText) {
    textarea.value = newText;
    updatePreview();
  }
});

function downloadPDF() {
  const link = document.createElement('a');
  link.href = '/output/output.pdf';
  link.download = 'document.pdf';
  link.click();
}

window.onload = updatePreview;