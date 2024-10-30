'use strict';

const express = require('express');
const { Sequelize} = require('sequelize');
const cookieParser = require('cookie-parser');

// Import the models
const { Users } = require('./models/Users');
const { Messages } = require('./models/Messages');
const { DirectChats } = require('./models/DirectChats');

// Import the routers
const UserRouter = require('./Router/UserRouter');

// Constants
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

// App
const app = express();
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

Users.sync({force:true}).then(result =>{
    console.log("Created users table")
})

Messages.sync({force:true}).then(result =>{
    console.log("Created messages table")
})

DirectChats.sync({force:true}).then(result =>{
    console.log("Created DirectChats table")
})



// Features for JSON Body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/static', express.static('public'))

// Start the actual server
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

// Routes
app.use('/users', UserRouter);

// Start database connection
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}