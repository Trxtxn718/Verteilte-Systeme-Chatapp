const express = require('express');
const router = express.Router();

const { DirectChats } = require('../models/DirectChats');
const { Users } = require('../models/Users');
const { Messages } = require('../models/Messages');

const { Op } = require('sequelize');

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

router.get('/user/:id', async (req, res) => {
    try {
        let answer = [];
        let chats = await DirectChats.findAll({ where: { [Op.or]: [{ user_1: req.params.id }, { user_2: req.params.id }] } })
        for (let chat of chats) {
            let user;
            if (chat.user_1 == req.params.id) {
                user = await Users.findByPk(chat.user_2)
                // console.log(user);
            } else {
                user = await Users.findByPk(chat.user_1)
                // console.log(user);
            }
            // answer.push({ chat: { id: chat.id, username: user.dataValues.username } });

            let lastMessage = await Messages.findOne({ where: { chat_id: chat.id }, order: [['time', 'DESC']] });
            console.log(lastMessage);
            answer.push({ chat: { id: chat.id, username: user.dataValues.username }, lastMessage: lastMessage });
        }
        res.status(200).json(answer);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

router.post('/', (req, res) => {
    const user1 = Users.findByPk(req.body.user_1);
    const user2 = Users.findByPk(req.body.user_2);

    if (user1 == null || user2 == null) {
        res.status(400).json({ message: "User not found." });
        return;
    }

    const chats = DirectChats.findAll({ where: { [Op.or]: [{ user_1: req.body.user_1, user_2: req.body.user_2 }, { user_1: req.body.user_2, user_2: req.body.user_1 }] } });
    if (chats.length > 0) {
        res.status(409).json({ message: "Chat already exists." });
        return;
    }

    DirectChats.create(req.body).then(chat => {
        res.status(201).json(chat);
    }).catch(err => {
        console.error(err);
        res.status(500).json(err);
    });
});

module.exports = router;