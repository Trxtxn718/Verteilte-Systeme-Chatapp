const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const { Users } = require('../models/Users');

// Try to get all users !!!DEBUG!!!
// TODO delete
router.get('/', (req, res) => {
    Users.findAll().then(users => {
        res.status(200).json(users);
    }).catch(err => {
        console.error(err);
        res.status(500).json(err);
    });
});

// Try to get user information of user with id
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
    // Check if user data is complete
    if (req.body.email == null || req.body.password == null || req.body.username == null) {
        res.status(400).json({
            message: "User data not complete."
        });
        return;
    }

    // Check if user already exists
    let user = await Users.findOne({ where: { email: req.body.email } });
    console.log(user);
    if (user != null) {
        res.status(409).json({
            message: "User already exists."
        })
        return;
    }

    // Add password hash and created date
    req.body.password = crypto.pbkdf2Sync(req.body.password, process.env.PASSWORD_SALT, 1000, 64, 'sha512').toString('hex');
    req.body.created = new Date().toISOString();
    req.body.updated = req.body.created;
    if (req.body.profile_img == null) {
        req.body.profile_img = "test-img.png";
    }
    // Create user
    Users.create(req.body).then(user => {
        // Set cookie with token
        res.cookie('token', jwt.sign({ id: user.id }, process.env.JWT_SECRET), {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 1000 * 60 * 60 * 24 * 7
        });
        res.status(201).json({
            message: "User created."
        });
    }).catch(err => {
        console.error(err);
        res.status(500).json(err);
    });
});

// Try to login user with email and password
router.post('/login', (req, res) => {
    // Check if user data is complete
    if (req.body.email == null || req.body.password == null) {
        res.status(400).json({
            message: "User data not complete."
        });
        return;
    }

    // Check if user exists
    Users.findOne({ where: { email: req.body.email } }).then(user => {
        if (user == null) {
            res.status(401).json({
                message: "User not found."
            });
            return;
        }
        // Check if password is correct
        if (user.password != crypto.pbkdf2Sync(req.body.password, process.env.PASSWORD_SALT, 1000, 64, 'sha512').toString('hex')) {
            res.status(401).json({
                message: "Password incorrect."
            });
            return;
        }
        // Set cookie with token
        res.cookie('token', jwt.sign({ id: user.id }, process.env.JWT_SECRET), {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 1000 * 60 * 60 * 24 * 7
        });
        res.status(200).json({
            message: "User logged in."
        });
    }).catch(err => {
        console.error(err);
        res.status(500).json(err);
    });
});

// Try to delete user with id
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