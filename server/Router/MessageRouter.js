const express = require('express');
const router = express.Router();

const {Messages} = require('../models/Messages');

router.get('/', (req, res) => {
    Messages.findAll().then(messages => {
        res.status(200).json(messages);
    }).catch(err => {
        console.error(err);
        res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
    Messages.findByPk(req.params.id).then(message => {
        res.status(200).json(message);
    }).catch(err => {
        console.error(err);
        res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
    Messages.create(req.body).then(message => {
        res.status(201).json(message);
    }).catch(err => {
        console.error(err);
        res.status(500).json(err);
    });
});

module.exports = router;