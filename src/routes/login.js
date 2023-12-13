const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Login route
router.get('/login', (req, res) => {
    res.render('login', { message: req.flash('message') });
});
router.get('/profile', (req, res) => {
    res.render('profile', { user: req.session.user });
});

// Edit profile route
router.get('/editProfile', (req, res) => {
    res.render('editProfile', { user: req.session.user });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('====================================');
    console.log(req.body);
    console.log('====================================');
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    try {
        const user = await User.findOne({ email, password });
        if (user) {
            req.session.user = user;
            return res.json({ success: true, message: 'Login successful' });
        } else {
            return res.status(401).json({ success: false, message: 'Incorrect email or password' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
    }
});

module.exports = router;
