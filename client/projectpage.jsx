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
        <form
            className="taskForm"
            onSubmit={(e) => handleTask(e, projectId, triggerReload)}
        >
            <input id="taskName" type="text" placeholder="Task Name" />
            <button type="submit">Add Task</button>
        </form>
    );
};

// Project list and task display component
const ProjectList = (props) => {
    const [projects, setProjects] = useState(props.projects);

    useEffect(() => {
        const loadProjectsFromServer = async () => {
            const response = await fetch('/getProjects');
            const data = await response.json();
            setProjects(data);
        };
        loadProjectsFromServer();
    }, [props.reloadProjects]);

    const handleDeleteTask = async (projectId, taskId) => {
        try {
            await helper.sendPost(`/deleteTask/${projectId}/${taskId}`);
            props.triggerReload();
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateTask = async (projectId, taskId, progress) => {
        try {
            await helper.sendPost(`/updateTask/${projectId}/${taskId}`, { progress });
            props.triggerReload();
        } catch (error) {
            console.error(error);
        }
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
                        <button onClick={() => handleUpdateTask(project._id, task._id, 'In Progress')}>
                            In Progress
                        </button>
                        <button onClick={() => handleUpdateTask(project._id, task._id, 'Completed')}>
                            Completed
                        </button>
                        <button onClick={() => handleDeleteTask(project._id, task._id)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    ));

    return <div>{projectNodes}</div>;
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

