'use strict';

const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');
const cookieParser = require('cookie-parser');

// Import the models
const { Users } = require('./models/Users');
const { Messages } = require('./models/Messages');
const { DirectChats } = require('./models/DirectChats');

// Import the routers
const UserRouter = require('./Router/UserRouter');
const ChatRouter = require('./Router/ChatRouter');
const MessageRouter = require('./Router/MessageRouter');

const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();


// Enable CORS
var corsOptions = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    if (req.method === 'OPTIONS') {
        res.send(200);
    }
    next();
}

app.use(corsOptions);

app.use(cookieParser());

// Database connection
const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOSTNAME,
    port: 3306,
    dialect: 'mariadb',
    models: [__dirname + '/models'],
    define: {
        timestamps: true
    }
});

// Test the database connection
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });



// Features for JSON Body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/static', express.static('public'))

// Start the actual server
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

// Routers
app.use('/users', UserRouter);
app.use('/chats', ChatRouter);
app.use('/messages', MessageRouter);