const express = require('express');
const router = express.Router();

const {DirectChats} = require('../models/DirectChats');

router.get('/', (req, res) => {
    DirectChats.findAll().then(chats => {
        res.status(200).json(chats);
    }).catch(err => {
        console.error(err);
        res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
    DirectChats.findByPk(req.params.id).then(chat => {
        res.status(200).json(chat);
    }).catch(err => {
        console.error(err);
        res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
    DirectChats.create(req.body).then(chat => {
        res.status(201).json(chat);
    }).catch(err => {
        console.error(err);
        res.status(500).json(err);
    });
});

module.exports = router;