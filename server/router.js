const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getProjects', mid.requiresLogin, controllers.Project.getProjects);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login, (req, res) => {
    res.redirect('/projectPage');
  });

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/projectPage', mid.requiresLogin, controllers.Project.getProjects);
  app.post('/createProject', mid.requiresLogin, controllers.Project.createProject);
  app.post('/addTask/:projectId', mid.requiresLogin, controllers.Project.addTask);
  app.delete('/deleteTask/:projectId/:taskId', mid.requiresLogin, controllers.Project.deleteTask);
  app.put('/updateTask/:projectId/:taskId', mid.requiresLogin, controllers.Project.updateTaskProgress);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;

module.exports = router;
