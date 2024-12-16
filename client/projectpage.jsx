const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

// Handle form submission to create a new project
const handleProject = (e, onProjectAdded) => {
  e.preventDefault();
  helper.hideError();

  const title = e.target.querySelector('#projectTitle').value;

  if (!title) {
    helper.handleError('Project title is required');
    return false;
  }

  helper.sendPost(e.target.action, { title }, onProjectAdded);
  return false;
};

// Handle form submission to add a task to a project
const handleTask = (e, projectId, onTaskAdded) => {
  e.preventDefault();
  helper.hideError();

  const name = e.target.querySelector('#taskName').value;

  if (!name) {
    helper.handleError('Task name is required');
    return false;
  }

  helper.sendPost(`/addTask/${projectId}`, { name }, onTaskAdded);
  return false;
};

// Project creation form component
const ProjectForm = (props) => {
  return (
    <form
      id="projectForm"
      onSubmit={(e) => handleProject(e, props.triggerReload)}
      name="projectForm"
      action="/createProject"
      method="POST"
      className="projectForm"
    >
      <label htmlFor="title">Project Title: </label>
      <input id="projectTitle" type="text" name="title" placeholder="Project Title" />
      <input className="makeProjectSubmit" type="submit" value="Create Project" />
    </form>
  );
};

// Task management form component
const TaskForm = ({ projectId, triggerReload }) => {
  return (
    <form className="taskForm" onSubmit={(e) => handleTask(e, projectId, triggerReload)}>
      <input id="taskName" type="text" placeholder="Task Name" />
      <button type="submit">Add Task</button>
    </form>
  );
};

const handleDeleteProject = async (projectId, triggerReload) => {
  try {
    const response = await fetch(`/deleteProject/${projectId}`, { method: 'DELETE' });
    if (response.ok) {
      triggerReload(); // Reload the project list
    } else {
      console.error('Failed to delete project');
    }
  } catch (error) {
    console.error('Error deleting project:', error);
  }
};

// Handle assigning a person to the task
const handleAssignPerson = async (projectId, taskId, person, triggerReload) => {
  const response = await fetch(`/assignPerson/${projectId}/${taskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ person }),
  });

  if (response.ok) {
    triggerReload(); // Reload project list
  } else {
    console.error('Failed to assign person to task');
  }
};

// Project list and task display component
const ProjectList = (props) => {
  const [projects, setProjects] = useState(props.projects);
  const [isPaidVersion, setIsPaidVersion] = useState(false); // This state tracks if we are in the paid version

  useEffect(() => {
    const loadProjectsFromServer = async () => {
      helper.sendRequest('/getProjects', 'GET', null, setProjects);
    };
    loadProjectsFromServer();
  }, [props.reloadProjects]);

  const handleDeleteTask = (projectId, taskId) => {
    helper.sendDelete(`/deleteTask/${projectId}/${taskId}`, props.triggerReload);
  };

  const handleUpdateTask = (projectId, taskId, progress) => {
    helper.sendPut(
      `/updateTask/${projectId}/${taskId}`,
      { progress },
      props.triggerReload
    );
  };

  // Toggle between Free and Paid versions
  const toggleVersion = () => {
    setIsPaidVersion((prevState) => !prevState);
  };

  if (projects.length === 0) {
    return <h3>No Projects Yet!</h3>;
  }

  const projectNodes = projects.map((project) => (
    <div key={project._id} className="project">
      <h2>{project.title}</h2>
      <TaskForm projectId={project._id} triggerReload={props.triggerReload} />
      <ul>
        {project.tasks.map((task) => (
          <li key={task._id}>
            {task.name} - {task.progress}
            {isPaidVersion && (
              <div>
                <label>
                  Assign Person:
                  <input
                    type="text"
                    placeholder="Enter person's name"
                    onBlur={(e) =>
                      handleAssignPerson(
                        project._id,
                        task._id,
                        e.target.value,
                        props.triggerReload
                      )
                    }
                  />
                </label>
                <span>
                  {task.assignedTo ? `Assigned to: ${task.assignedTo}` : 'Not Assigned'}
                </span>
              </div>
            )}
            <button onClick={() => handleUpdateTask(project._id, task._id, 'In Progress')}>
              In Progress
            </button>
            <button onClick={() => handleUpdateTask(project._id, task._id, 'Completed')}>
              Completed
            </button>
            <button onClick={() => handleDeleteTask(project._id, task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  ));

  return (
    <div>
      <button onClick={toggleVersion}>
        {isPaidVersion ? 'Switch to Free Version' : 'Switch to Paid Version'}
      </button>
      {projectNodes}
    </div>
  );
};

// Main App Component
const App = () => {
  const [reloadProjects, setReloadProjects] = useState(false);

  return (
    <div>
      <h1>Project Management Tool</h1>
      <div id="createProject">
        <ProjectForm triggerReload={() => setReloadProjects(!reloadProjects)} />
      </div>
      <div id="projects">
        <ProjectList
          projects={[]}
          reloadProjects={reloadProjects}
          triggerReload={() => setReloadProjects(!reloadProjects)}
        />
      </div>
    </div>
  );
};

// Initialize the React app
const init = () => {
  const root = createRoot(document.querySelector('#app'));
  root.render(<App />);
};

window.onload = init;
