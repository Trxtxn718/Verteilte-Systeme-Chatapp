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

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
// app.use(cors());
// app.use(cors({
//     origin: ['http://localhost:4200'],
//     credentials: true
// }));
var corsOptions = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    // res.header('Access-Control-Allow-Credentials', true);
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

// Routes
app.use('/users', UserRouter);

app.get('/', (req, res) => {
    res.send('Hello World');
});
app.post('/', (req, res) => {
    console.log("Recieved request");
    res.json({message: 'Hello World'});
});

// Start database connection
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}