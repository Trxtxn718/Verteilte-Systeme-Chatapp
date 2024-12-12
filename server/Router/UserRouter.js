const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const { Users } = require('../models/Users');

// Try to get all users !!!DEBUG!!!
// TODO delete
router.get('/', async (req, res) => {
    Users.findAll().then(users => {
        res.status(200).json(users);
    }).catch(err => {
        console.error(err);
        res.status(500).json(err);
    });
});

// Try to get user information of user with id
router.get('/:id', async (req, res) => {
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
    if (req.body.email == null || req.body.password == null || req.body.username == null || req.body.passwordRepeat == null) {
        res.status(400).json({
            message: "User data not complete."
        });
        return;
    }

    // Check if passwords match
    if (req.body.password != req.body.passwordRepeat) {
        res.status(400).json({
            message: "Passwords do not match."
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
        res.cookie('token', jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET), {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
        });
        res.status(201).json({username: user.username, email: user.email, id: user.id});
    }).catch(err => {
        console.error(err);
        res.status(500).json(err);
    });
});

// Try to login user with email and password
router.post('/login', async (req, res) => {
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
                message: "Wrong credentials."
            });
            return;
        }
        // Check if password is correct
        if (user.password != crypto.pbkdf2Sync(req.body.password, process.env.PASSWORD_SALT, 1000, 64, 'sha512').toString('hex')) {
            res.status(401).json({
                message: "Wrong credentials."
            });
            return;
        }
        // Set cookie with token
        res.cookie('token', jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET), {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
        });
        res.status(200).json({username: user.username, email: user.email, id: user.id});
    }).catch(err => {
        console.error(err);
        res.status(500).json(err);
    });
});

// Try to update user with id and attributes
router.put('/:id', async (req, res) => {

    // Check if user data is complete
    if (req.body.password == null) {
        res.status(400).json({
            message: "User data not complete."
        });
        return;
    }

    if ((req.body.newPassword != null && req.body.newPasswordRepeat != req.body.newPassword) || (req.body.newPasswordRepeat != null && req.body.newPassword != req.body.newPasswordRepeat)) {
        res.status(400).json({
            message: "Passwords do not match."
        });
        return;
    }

    // Check if user exists
    Users.findByPk(req.params.id).then(user => {
        if (user == null) {
            res.status(404).json({
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
        // Check if new username is unique
        if (req.body.username != null) {
            Users.findOne({ where: { username: req.body.username } }).then(user => {
                if (user != null) {
                    res.status(409).json({
                        message: "Username already exists."
                    });
                    return;
                }
            }).catch(err => {
                console.error(err);
                res.status(500).json(err);
            });
        }
    }).catch(err => {
        console.error(err);
        res.status(500).json(err);
    });

    // Update user
    req.body.updated = new Date().toISOString();
    if (req.body.newPassword != null) {
        req.body.password = crypto.pbkdf2Sync(req.body.newPassword, process.env.PASSWORD_SALT, 1000, 64, 'sha512').toString('hex');
    }
    Users.update(req.body, {
        where: {
            id: req.params.id
        }
    }).then(() => {
        res.status(204).send();
    }).catch(err => {
        console.error(err);
        res.status(500).json(err);
    });
});

// Try to delete user with id
router.delete('/:id', async (req, res) => {
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