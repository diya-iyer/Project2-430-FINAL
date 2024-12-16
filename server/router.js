const path = require('path'); // Add path module to serve static files
const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  // API endpoints for data
  app.get('/getProjects', mid.requiresLogin, controllers.Project.getProjects);
  app.post('/createProject', mid.requiresLogin, controllers.Project.createProject);
  app.post('/addTask/:projectId', mid.requiresLogin, controllers.Project.addTask);
  app.put('/updateTask/:projectId/:taskId', mid.requiresLogin, controllers.Project.updateTaskProgress);
  app.delete('/deleteTask/:projectId/:taskId', mid.requiresLogin, controllers.Project.deleteTask);
  app.delete('/deleteProject/:projectId', controllers.Project.deleteProject);
  app.put('/assignPerson/:projectId/:taskId', controllers.Project.assignPersonToTask);
  // Login and signup routes
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login, (req, res) => {
    res.redirect('/projectPage'); // Redirect to project page after login
  });
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  // Logout route
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  // Route to serve project page (React app entry point)
  app.get('/projectPage', mid.requiresLogin, controllers.Project.projectPage);

  // Default route to login page
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
