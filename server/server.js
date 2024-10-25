'use strict';

const express = require('express');
const { Sequelize} = require('sequelize');

// Import the models
const { Users } = require('./models/Users');
const { Messages } = require('./models/Messages');

// Constants
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

// App
const app = express();

// Database connection

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOSTNAME,
    port: 3306,
    dialect: 'mariadb',
    models: [__dirname + '/models'],
    define: {
        timestamps: false
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

// ###################### DATABASE PART ######################
app.get('/users', (req, res) => {
    Users.findAll().then(users => {
        console.log("Models funktioniert");
        res.json(users);
    });
});


// ###################### DATABASE PART END ######################



// All requests to /static/... will be redirected to static files in the folder "public"
// call it with: http://localhost:8080/static
app.use('/static', express.static('public'))

// Start the actual server
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

// Start database connection
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}