const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/user');

// Set up Multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Register route
router.get('/register', (req, res) => {
    res.render('register', { message: req.flash('message') });
});

router.post('/register', upload.single('profileImage'), async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const profileImage = req.file ? `/uploads/${req.file.filename}` : '/images/blue-avatar.png';

    // Server-side validation
    if (!firstName || !lastName || !email || !password) {
        req.flash('message', 'All fields are required');
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash('message', 'Email is already registered');
            return res.status(400).json({ success: false, message: 'Email is already registered' });
        }

        // Create a new user with the profile image
        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            profileImage,
        });

        console.log('====================================');
        console.log(user);
        console.log('====================================');
        req.flash('message', 'Registration successful. Please log in.');
        res.render('login');
    } catch (error) {
        console.error(error);
        req.flash('message', 'Registration failed. Please try again.');
        res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
    }
});

router.patch('/updateProfile/:id', upload.single('profileImage'), async (req, res) => {
    const id=req.params.id;
    const { firstName, lastName, email, password } = req.body;
    const profileImage = req.file ? `/uploads/${req.file.filename}` : undefined;
    try {
        const existingUser = await User.findById(id);
        if (!existingUser) {
            return res.status(400).json({ success: false, message: 'user not found' });
        }
        const user = await User.findByIdAndUpdate(id,{
            firstName,
            lastName,
            email,
            profileImage,
        });
        req.flash('message', 'Registration successful. Please log in.');
        res.redirect("login");
    } catch (error) {
        console.error(error);
        req.flash('message', 'Registration failed. Please try again.');
        res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
    }
});


module.exports = router;
