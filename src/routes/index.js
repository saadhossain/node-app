const express = require('express');
const Project = require('../models/project');
const router = express.Router();

router.use(require('./login'));
router.use(require('./register'));
router.use(require('./projects'));

// Home route
router.get('/',  async(req, res) => {
    const projects=await Project.find().lean();
     res.render('projects', { message: req.flash('message'),user:req.session.user,projects });
});

// Logout route
router.get('/logout', (req, res) => {
    // Clear the session and redirect to the home page
    req.session.destroy();
    res.redirect('/');
});

router.get("*", (req,res,next)=>{
res.render('notfound');
})

module.exports = router;
