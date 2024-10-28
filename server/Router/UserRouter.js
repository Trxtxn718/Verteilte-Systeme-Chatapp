const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const { Users } = require('../models/Users');

// Get all users DEBUG
// TODO delete
router.get('/', (req, res) => {
    Users.findAll().then(users => {
        res.status(200).json(users);
    }).catch(err => {
        console.error(err);
        res.status(500).json(err);
    });
});

// Get user information of user with id
router.get('/:id', (req, res) => {
    Users.findByPk(req.params.id).then(user => {
        res.status(200).json(user);
    }).catch(err => {
        console.error(err);
        res.status(500).json(err);
    });
});

// Try to create new user with attributes
router.post('/register', async (req, res) => {
    let user = await Users.findByPk(req.body.id)
    if (user != null) {
        res.status(409).json({
            message: "User already exists."
        })
        return;
    }
    if (req.body.email == null || req.body.password == null || req.body.username == null){
        res.status(400).json({
            message: "User data not complete."
        });
        return;
    }

    req.body.created = new Date().toISOString();
    req.body.updated = req.body.created;
    if (req.body.profile_img == null) {
        req.body.profile_img = "test-img.png";
    }
    Users.create(req.body).then(user => {
        user.token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        res.status(201).json(user);
    }).catch(err => {
        console.error(err);
        res.status(500).json(err);
    });
});

router.post('/login', (req, res) => {

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