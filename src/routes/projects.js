const express = require('express');
const router = express.Router();
const multer = require('multer');
const Project = require('../models/project');

// Set up Multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images'); // Specify the directory where you want to store images
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Add a timestamp to the filename
    }
});

const upload = multer({ storage: storage });

// Get all projects
router.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find();
        res.render('projects', { projects, user: req.session.user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Render add project form
router.get('/addProject', (req, res) => {
    res.render('addProject', { user: req.session.user });
});

// Create a new project
router.post('/projects', upload.single('image'), async (req, res) => {
    // Mock user authentication (replace this with your actual user authentication logic)
    const { title, subtitle, ownerName, description } = req.body;
    const image = req.file ? `/images/${req.file.filename}` : ''; // Use the uploaded image path
    const newProject = new Project({ title, subtitle, ownerName, description, image });
    try {
        await newProject.save();    
        // const projects=await Project.find().lean();
        // res.status(201).json({ user: req.session.user, projects });
        res.redirect('/');

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});



// Update a project by ID
router.put('/projects/:id', async (req, res) => {
    const { image, title, subtitle, ownerName, description } = req.body;
    try {
        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            { image, title, subtitle, ownerName, description },
            { new: true }
        );
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Delete a project by ID
router.delete('/projects/:id', async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

router.get('/editProject/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        res.render('editProject', { project });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

router.patch('/projects/:id', upload.single('image'), async (req, res) => {
    console.log("Hello",req.body);
    const { title, subtitle, ownerName, description } = req.body;
    const image = req.file ? `/images/${req.file.filename}` : project.image; // Use the uploaded image path, or keep the existing image
    try {
        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            { title, subtitle, ownerName, description, image },
            { new: true }
        );
        res.status(200).json({ success: true, project: updatedProject });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});



module.exports = router;
