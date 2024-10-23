const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    connection.query("SELECT * FROM `Users`;", function (error, results, fields) {
        if (error) {
            console.error(error); 
            res.status(500).json(error); 
        } else {
            console.log('Success answer from DB: ', results); 
            res.status(200).json(results);
        }
    });
});