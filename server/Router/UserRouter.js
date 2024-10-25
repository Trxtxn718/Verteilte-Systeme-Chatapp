const express = require('express');
const router = express.Router();

const { Users } = require('../models/Users');

router.get('/', (req, res) => {
    console.log("Request to load all entries from table1");
    // Prepare the get query
    Users.findAll().then(users => {
        res.status(200).json(users);
    }).catch(err => {
        console.error(err);
        res.status(500).json(err);
    });
});

module.exports = router;