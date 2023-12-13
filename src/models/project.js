const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    image: String,
    title: String,
    subtitle: String,
    ownerName: String,
    description: String,
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
