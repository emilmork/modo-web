
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , pageController = require('./controllers/pages')
  , gameController = require('./controllers/games')
  , path = require('path')
  , socketio = require('socket.io')
  , join = require('path').join
  , actionHero = require('./node_modules/actionhero_client/actionhero_client.js');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  //app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/page.js', function(req, res){
  console.log(__dirname);
  res.sendfile(join(__dirname, 'node_modules/page/', 'index.js'));
});

  var auth = express.basicAuth(function(user, pass) {
    return user === 'emil' && pass === 'mork';
  });

  app.auth = auth;

var server =  http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


pageController.setup(app);
gameController.setup(socketio,server,actionHero);














