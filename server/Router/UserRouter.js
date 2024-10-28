const express = require('express');
const router = express.Router();

const { Users } = require('../models/Users');

router.get('/', (req, res) => {
    Users.findAll().then(users => {
        res.status(200).json(users);
    }).catch(err => {
        console.error(err);
        res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
    Users.findByPk(req.params.id).then(user => {
        res.status(200).json(user);
    }).catch(err => {
        console.error(err);
        res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
    Users.create(req.body).then(user => {
        res.status(201).json(user);
    }).catch(err => {
        console.error(err);
        res.status(500).json(err);
    });
});

router.delete('/:id', (req, res) => {
    Users.destroy({
        where: {
            id: req.params.id
        }
    }).then(() => {
        res.status(204).send();
    }).catch(err => {
        console.error(err);
        res.status(500).json(err);
    });
}
);

module.exports = router;