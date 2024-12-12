const { Server } = require("socket.io");
const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const mqttAdapter = require("socket.io-mqtt");
const mqtt = require("mqtt");
const { formatMessage } = require("./message.service");


const app = express();
const server = createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '127.0.0.1'

const users = {};

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'))
})

io.adapter(mqttAdapter(
  {
    host: 'mqtt://mqtt',
    port: 1883
  }
));


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
    console.log(formatedMessage);
    if (users[formatedMessage.receiver_id] != null) {
      io.to(users[formatedMessage.receiver_id]).emit('message',JSON.stringify(formatedMessage));
    }
    else {
      console.log(`User ${formatedMessage.receiver_id} not online`);
      mqttClient.publish('VSChatMessage/topic', JSON.stringify(formatedMessage));
    }
  });

  socket.on('disconnect', () => {
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
    io.to(users[messageObj.receiver_id]).emit('message',JSON.stringify(formatedMessage));
  }
  else {
    console.log(`User ${messageObj.receiver_id} not online`);
  }
});

// Themen abonnieren
mqttClient.subscribe('VSChatMessage/topic');


server.listen(PORT, '0.0.0.0');
console.log(`Running on http://${HOST}:${PORT}`);
