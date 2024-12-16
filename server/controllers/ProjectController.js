const Project = require('../models/Project');

const projectPage = (req, res) => res.render('app');
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

    // Remove the task by filtering it out from the array
    const updatedTasks = project.tasks.filter((task) => task._id.toString() !== taskId);
    project.tasks = updatedTasks;

    await project.save();
    return res.status(200).json({ message: 'Task deleted successfully', project });
  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({ error: 'Failed to delete task' });
  }
};

const updateTaskProgress = async (req, res) => {
  const { projectId, taskId } = req.params;
  const { progress } = req.body;

  const validProgress = ['Not Started', 'In Progress', 'Completed'];
  if (!validProgress.includes(progress)) {
    return res.status(400).json({ error: 'Invalid progress value' });
  }

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const task = project.tasks.id(taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    task.progress = progress;
    await project.save();
    return res.status(200).json({ message: 'Task updated successfully', project });
  } catch (error) {
    console.error('Error updating task progress:', error);
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

const deleteProject = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findByIdAndDelete(projectId); // Deletes the project directly

    if (!project) return res.status(404).json({ error: 'Project not found' });

    return res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return res.status(500).json({ error: 'Failed to delete project' });
  }
};


const assignPersonToTask = async (req, res) => {
  const { projectId, taskId } = req.params;
  const { person } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const task = project.tasks.id(taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    task.assignedTo = person; // Assign the person to the task
    await project.save();

    return res.status(200).json({ message: 'Person assigned successfully', task });
  } catch (error) {
    console.error('Error assigning person:', error);
    return res.status(500).json({ error: 'Failed to assign person' });
  }
};

module.exports = {
  createProject,
  addTask,
  deleteTask,
  updateTaskProgress,
  getProjects,
  projectPage,
  assignPersonToTask, 
  deleteProject
};
