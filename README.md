**Documentation**

What is the purpose of your application? What does it do?

The purpose of this application is to provide a Project Management Tool where users can create, manage, and track their projects and tasks. Users can sign in, create new projects, and manage tasks within those projects. The application allows users to create projects, assign tasks to team members, and track their progress over time. It provides an organized way to manage work and collaborate efficiently on multiple projects at once.

How are you using React?

React is being used to build the frontend of the application, enabling a dynamic and interactive user interface. The user interface is composed of various components that update in real-time based on user interactions, such as logging in, signing up, creating projects, and managing tasks. The React components help manage state, render the appropriate content, and interact with the backend through asynchronous HTTP requests. The React code is structured to allow for smooth transitions between different sections of the app, such as switching between the login and signup forms or displaying the projects page.

What components do you have?

The main components in the application are:

LoginWindow: A form component that allows users to log in by entering their username and password.
SignupWindow: A form component for new users to sign up by providing a username, password, and confirming the password.
ProjectManagement: A component responsible for displaying the user's projects and providing options to create, update, or delete projects.
CreateProject: A component that allows users to create new projects by filling out a form with project details.
TaskManagement: A component within each project to manage tasks, allowing users to add, edit, or delete tasks associated with that project.
What data are you storing in MongoDB?

In MongoDB, the application stores user information, including usernames and passwords, for authentication purposes. It also stores projects and tasks, with each project having associated tasks. The data model consists of a user schema, a project schema, and a task schema. The user schema stores login credentials and user-specific information. The project schema contains details about each project, such as project names and descriptions. The task schema stores individual tasks linked to projects, including task descriptions, deadlines, and assigned team members.

What went right in the development of this project?: 

I was able to figure out how to stack information of various components into one another, such as the projects and the tasks and the details within the task. That was something I was worried about, but was able to figure it out and have it work out smoothly. 

What went wrong in the development of this project?

A lot of things honestly. Getting rid of the Domo files and figuring out where exactly they were all hooked up was a hassle, and then fixing issues across files was frustrating. I figured most things out, but I didn't feel as prepared as I thought I would've been from the DomoMaker assignment

What did you learn while developing this project?

While developing this project, I learned a great deal about full-stack development, especially about the interplay between frontend (React) and backend (Node.js with Express). I gained a deeper understanding of how to handle user authentication, manage sessions, and integrate caching with Redis. I also learned how to manage data in MongoDB, including setting up schemas and handling CRUD operations for users, projects, and tasks. Additionally, I improved my problem-solving skills, especially when troubleshooting issues with API requests and managing application state across different components.

If you were to continue, what would you do to improve your application?

If I were to continue, I would focus on improving the user experience by implementing features such as real-time collaboration on projects and tasks, similar to what you'd find in tools like Trello or Asana. I would also enhance the UI by implementing a more sophisticated design with better mobile responsiveness. Additionally, I would improve error handling, both on the frontend and backend, to ensure the application is more resilient to unexpected failures. Implementing more comprehensive unit and integration tests would also be a priority to ensure the reliability of the application.

If you went above and beyond, how did you do so?

Wasn't able to fully flesh out my idea, but I wanted to implement d3.js to do some more data visualization. I plan to continue integrating this into the app in the future. 

If you used any borrowed code or code fragments, where did you get them from? What do the code fragments do? Where are they in your code?

N/A

**Endpoint Documentation**:

1. /getProjects
Supported Methods: GET
Middleware: Requires Login
Query Params: None
Description: This endpoint retrieves all the projects associated with the currently logged-in user.
Return Type(s): JSON (list of projects)
2. /createProject
Supported Methods: POST
Middleware: Requires Login
Query Params: None
Body Params: Project data (e.g., project name, description)
Description: This endpoint allows a logged-in user to create a new project.
Return Type(s): JSON (new project details)
3. /addTask/:projectId
Supported Methods: POST
Middleware: Requires Login
Query Params: None
Body Params: Task data (e.g., task name, description)
Description: This endpoint allows a user to add a new task to a specific project, identified by the projectId.
Return Type(s): JSON (updated project with new task)
4. /updateTask/:projectId/:taskId
Supported Methods: PUT
Middleware: Requires Login
Query Params: None
Body Params: Task update data (e.g., progress status)
Description: This endpoint allows a user to update the progress of a task in a specific project.
Return Type(s): JSON (updated task details)
5. /deleteTask/:projectId/:taskId
Supported Methods: DELETE
Middleware: Requires Login
Query Params: None
Description: This endpoint deletes a specific task from a project, identified by both projectId and taskId.
Return Type(s): JSON (success or error message)
6. /deleteProject/:projectId
Supported Methods: DELETE
Middleware: None (no login required)
Query Params: None
Description: This endpoint deletes a specific project, identified by projectId.
Return Type(s): JSON (success or error message)
7. /assignPerson/:projectId/:taskId
Supported Methods: PUT
Middleware: None (no login required)
Query Params: None
Body Params: User information (e.g., user ID) for assigning a task
Description: This endpoint assigns a user to a specific task in a project.
Return Type(s): JSON (updated task with assigned user)
8. /login
Supported Methods: GET, POST
Middleware: Requires Secure, Requires Logout
Query Params: None
Body Params: User credentials (e.g., username, password)
Description: This endpoint handles user login. The GET request returns the login page, and the POST request authenticates the user.
Return Type(s): On success, redirects to /projectPage. If invalid credentials, returns error message.
9. /signup
Supported Methods: POST
Middleware: Requires Secure, Requires Logout
Query Params: None
Body Params: User registration data (e.g., username, password)
Description: This endpoint handles user registration.
Return Type(s): JSON (user account creation success or failure)
10. /logout
Supported Methods: GET
Middleware: Requires Login
Query Params: None
Description: This endpoint handles user logout and clears the session.
Return Type(s): JSON (success message)
11. /projectPage
Supported Methods: GET
Middleware: Requires Login
Query Params: None
Description: This endpoint serves the project page, which contains the main application interface, after a successful login.
Return Type(s): HTML (React app entry point)
12. / (Default route)
Supported Methods: GET
Middleware: Requires Secure, Requires Logout
Query Params: None
Description: This is the default route that serves the login page for users who are not logged in.
Return Type(s): HTML (login page)
