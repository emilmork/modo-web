var PageController = exports.Pages = function () {

};

exports.setup = function (app) {
  var controller = new PageController();
  controller.app = app;

  // helper.gatekeeper("/login") will check if logged in, and send to /login
  // if not logged in.
  app.get('/', controller.frontpage); 
  app.get('/games', controller.games);
  app.get('/about', controller.about);
  app.get('/teams', controller.teams);
  app.get('/admin',app.auth,controller.admin);
  app.get('/teams/:team/:id',controller.game);
};


PageController.prototype.game = function(req,res){
  res.render('index', { game: req.params.id});
}


PageController.prototype.frontpage = function(req, res){
	res.render('index', { title: 'Express' });
};

PageController.prototype.games = function(req, res){
	res.render('index', { title: 'Express' });
};


PageController.prototype.about = function(req, res){
	res.render('index', { title: 'Express' });
};

PageController.prototype.teams = function(req, res){
	res.render('index', { title: 'Express' });
};

PageController.prototype.admin = function(req, res){
  res.send("Welcome to admin page");
};