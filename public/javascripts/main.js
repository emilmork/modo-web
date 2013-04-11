var App = {};



require.config({
  baseUrl: '../',
  name: 'javascripts/main',
  out: "main-built.js",

  paths: {
    // Libraries
    jquery:   'javascripts/libs/jquery/jquery.182',
    jquery_validation: 'javascripts/libs/jquery/jquery.validate.min',
    bootstrap: 'javascripts/libs/bootstrap/bootstrap',
    ish : 'javascripts/libs/icanhaz/ICanHaz',
    handlebar : 'javascripts/libs/icanhaz/handlebars',
    scripts: 'javascripts/plugins',
    socket: '/socket.io/socket.io',
    chart: 'javascripts/libs/highcharts/highcharts'
  },
  
  shim: {
    bootstrap: {
      deps: ['jquery']
    }
  }
});



define(['jquery', '/page.js','scripts/game','scripts/games','scripts/teams','scripts/contact','scripts/base','socket','ish','handlebar','chart','jquery_validation'], function($) {  
  var Routes = {
  	frontpage: function () {
       $('#front-page-content').show().siblings('.page-role').hide();
       console.log("Front page");
    },
    games: function () {
       $("a[href='/games']").parent().addClass("active").siblings().removeClass('active');
        $('#games-content').showGames();
    },
    teams: function () {
      	$("a[href='/teams']").parent().addClass("active").siblings().removeClass('active');
        $('#teams-content').showTeams();
    },
    about: function () {
    	$("a[href='/about']").parent().addClass("active").siblings().removeClass('active');
      $('#contact-content').showContact();
    },
    game: function(req,res){
      console.log("Game method called");
      $('#selected-game-content').showSelectedGame(req);
    }
  };


  $(function () {
    // Set up routes.
    page('/', Routes.frontpage);
    page('/games', Routes.games);
    page('/about', Routes.about);
    page('/teams', Routes.teams);
    page('/teams/:team/:id',Routes.game);
    page();
  });


  
});