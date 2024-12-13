const express = require('express');
const router = express.Router();

const { Messages } = require('../models/Messages');
const { Users } = require('../models/Users');
const { Op } = require('sequelize');

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
    req.body.time = new Date().toISOString();
    Messages.create(req.body).then(message => {
        res.status(201).json(message);
    }).catch(err => {
        console.error(err);
        res.status(500).json(err);
    });
});

router.get('/chat/:id', async (req, res) => {
    let max_id = req.query.max_id ? req.query.max_id : 0;
    let limit = req.query.limit ? Number(req.query.limit) : 20;

    let answer = [];
    if (max_id != 0) {
        try {
            let messages = await Messages.findAll({ limit: limit, where: { chat_id: req.params.id, id: { [Op.lt]: max_id } }, order: [["id", "DESC"]] })
            for (let message of messages) {
                let user = await Users.findByPk(message.user_id);
                // console.log(user);
                answer.push({ id: message.dataValues.id, username: user.dataValues.username, time: message.dataValues.time, content: message.dataValues.content });
            }

            // messages.forEach(message => {
            //     let user = await Users.findByPk(message.user_id);
            //     console.log(user);
            //     answer.push({ username: user.dataValues.username, time: message.dataValues.time, content: message.dataValues.content });
            // });

            res.status(200).json(answer);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    } else {
        try {
            let messages = await Messages.findAll({ limit: limit, where: { chat_id: req.params.id }, order: [["id", "DESC"]] })
            for (let message of messages) {
                let user = await Users.findByPk(message.user_id);
                // console.log(user);
                answer.push({ id: message.dataValues.id, username: user.dataValues.username, time: message.dataValues.time, content: message.dataValues.content });
            }
            // messages.forEach(message => {
            //     let user = await Users.findByPk(message.user_id);
            //     console.log(user);
            //     answer.push({ username: user.dataValues.username, time: message.dataValues.time, content: message.dataValues.content });
            // });
            res.status(200).json(answer);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    }
});

module.exports = router;