const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let sharedText = '';

app.use(express.static(path.join(__dirname, 'public')));
app.use('/output', express.static(path.join(__dirname, 'output')));
app.use(bodyParser.json());

io.on('connection', (socket) => {
  socket.emit('text-update', sharedText);
  socket.on('text-update', (newText) => {
    sharedText = newText;
    socket.broadcast.emit('text-update', newText);
  });
});

app.post('/compile', (req, res) => {
  const latexContent = req.body.latex;
  const texFile = path.join(__dirname, 'output', 'output.tex');
  const outputDir = path.join(__dirname, 'output');

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  fs.writeFileSync(texFile, latexContent);

  exec(`pdflatex -output-directory=${outputDir} ${texFile}`, (err) => {
    if (err) return res.status(500).send('Erreur de compilation LaTeX');
    res.send('OK');
  });
});

server.listen(3000, () => {
  console.log('Serveur lancé sur http://localhost:3000');
});