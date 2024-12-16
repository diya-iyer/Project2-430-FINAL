const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  progress: { type: String, enum: ['Not Started', 'In Progress', 'Completed'], default: 'Not Started' },
});

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tasks: [TaskSchema],
  createdDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Project', ProjectSchema);
