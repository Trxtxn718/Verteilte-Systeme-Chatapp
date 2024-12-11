const { Server } = require("socket.io");
const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");

const app = express();
const server = createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '127.0.0.1'

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'))
})


io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });
});
    console.log(socket)  
    socket.on('chat message', (msg) => {
      console.log('message: ' + msg);
    });
  });

server.listen(PORT, '0.0.0.0');
console.log(`Running on http://${HOST}:${PORT}`);
