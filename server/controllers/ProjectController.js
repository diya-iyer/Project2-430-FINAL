const Project = require('../models/Project');

const createProject = async (req, res) => {
  const { title } = req.body;
  try {
    const newProject = new Project({ title });
    await newProject.save();
    return res.status(201).json(newProject);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create project' });
  }
};

const addTask = async (req, res) => {
  const { projectId } = req.params;
  const { name } = req.body;
  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    project.tasks.push({ name });
    await project.save();
    return res.status(200).json(project);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to add task' });
  }
};

const deleteTask = async (req, res) => {
  const { projectId, taskId } = req.params;
  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    project.tasks = project.tasks.filter((task) => task._id.toString() !== taskId);
    await project.save();
    return res.status(200).json(project);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete task' });
  }
};

const updateTaskProgress = async (req, res) => {
  const { projectId, taskId } = req.params;
  const { progress } = req.body;
  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const task = project.tasks.id(taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    task.progress = progress;
    await project.save();
    return res.status(200).json(project);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update task progress' });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    return res.status(200).json(projects);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

module.exports = {
  createProject,
  addTask,
  deleteTask,
  updateTaskProgress,
  getProjects,
};
