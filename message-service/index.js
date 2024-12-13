const { Server } = require("socket.io");
const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const mqttAdapter = require("socket.io-mqtt");
const mqtt = require("mqtt");
const { formatMessage } = require("./message.service");



const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ['Content-Type, Authorization, Content-Length, X-Requested-With'],
  },
});

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '127.0.0.1'

const users = {};

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'))
})


app.get('/chat', (req, res) => {
  io.emit('chat', 'Hello from Server');
})
io.on('connection', (socket) => {
  console.log('user connected');

  //TODO Check if user is registered
  socket.on('register', (userId) => {
    console.log(`User ${userId} registered`);
    users[userId] = socket.id;
    console.log(users);
  });

  socket.on('message', async (msg) => {
    msgObj = await JSON.parse(msg);
    console.log(`Message received: ${msgObj.message}`);
    const formatedMessage = await formatMessage(msgObj);
    console.log('Formated Message' + formatedMessage);
    mqttClient.publish('VSChatMessage/topic', JSON.stringify(formatedMessage));

  });

  socket.on('chat', async (chat) => {
    chat = JSON.parse(chat);
    console.log('Chat:' + chat);
    console.log('Chat:' + chat.user_id);
    const user = await fetch(`http://nginx:80/backend/users/getUserByUsername/${chat.target_user}`);
    console.log(user);
    const userJson = await user.json();
    console.log(userJson);
    const chatObj = {
      user_1: chat.user_id,
      user_2: userJson.id
    };
    const newChat = await (await fetch('http://nginx:80/backend/chats/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(chatObj)
    })).json();
    const username = await (await fetch(`http://nginx:80/backend/users/${chat.user_id}`)).json()
    console.log('Username: ');
    console.log(username.username)
    const payload = {
      receiver_id: chat.user_id,
      chat: newChat,
      user1: {
        id: chat.user_id,
        username: username.username
      },
      user2: {
        id: userJson.id,
        username: userJson.username
      }
    };
    console.log( payload);
    mqttClient.publish('VSChatCreation/topic', JSON.stringify(payload));
    payload.receiver_id = userJson.id;
    mqttClient.publish('VSChatCreation/topic', JSON.stringify(payload));
  });


  socket.on('disconnect', () => {
    const userId = Object.keys(users).find((key) => users[key] === socket.id);

    if (userId) {
      delete users[userId]; // Entferne den Benutzer aus dem Objekt
      console.log(`Nutzer abgemeldet: ${userId}`);
    }
    console.log("Users: " + users);
    console.log('user disconnected');
  });
});


const mqttClient = mqtt.connect('mqtt://broker.hivemq.com');
console.log('MQTT-Client connecting to HiveMQ');
mqttClient.on('connect', () => {
  console.log('MQTT-Client connected to MQTT-Broker');
  mqttClient.publish('test/topic', 'Hello from Websocket!');
});

mqttClient.on('message', (topic, message) => {
  console.log(`MQTT Message received:${message.toString()}`);
  const messageObj = JSON.parse(message);
  if (users[messageObj.receiver_id] != null) {
    if (topic === 'VSChatMessage/topic') {
      console.log('socket id: ' + users[messageObj.receiver_id]);
      io.to(users[messageObj.receiver_id]).emit('message', JSON.stringify(messageObj));
    }
    else if (topic === 'VSChatCreation/topic') {
      console.log('socket id: ' + users[messageObj.receiver_id]);
      io.to(users[messageObj.receiver_id]).emit('chat', JSON.stringify(messageObj));
    }
  }
  else {
    console.log(`User ${messageObj.receiver_id} not online`);
  }
});

// Themen abonnieren
mqttClient.subscribe('VSChatMessage/topic');
mqttClient.subscribe('VSChatCreation/topic');


server.listen(PORT, '0.0.0.0');
console.log(`Running on http://${HOST}:${PORT}`);
