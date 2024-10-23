'use strict';

const express = require('express');
const { Sequelize} = require('sequelize');


// Constants
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

// App
const app = express();

// Database connection

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOSTNAME,
    dialect: 'mariadb'
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

// Entrypoint - call it with: http://localhost:8080/ -> redirect you to http://localhost:8080/static
app.get('/', (req, res) => {

    res.status(200)
});

// ###################### DATABASE PART ######################
app.get('/users', (req, res) => {
    console.log("Request to load all entries from table1");
    // Prepare the get query
    connection.query("SELECT * FROM `Users`;", function (error, results, fields) {
        if (error) {
            // we got an errror - inform the client
            console.error(error); // <- log error in server
            res.status(500).json(error); // <- send to client
        } else {
            // we got no error - send it to the client
            console.log('Success answer from DB: ', results); // <- log results in console
            // INFO: Here could be some code to modify the result
            res.status(200).json(results); // <- send it to client
        }
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