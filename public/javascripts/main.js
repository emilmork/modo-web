var App = {};



require.config({
  baseUrl: '../',
  name: 'javascripts/main',
  out: "main-built.js",

  paths: {
    // Libraries
    jquery:   'javascripts/libs/jquery/jquery.182',
    bootstrap: 'javascripts/libs/bootstrap/bootstrap',
    ish : 'javascripts/libs/icanhaz/ICanHaz',
    scripts: 'javascripts/plugins',
    socket: '/socket.io/socket.io',
  },
  
  shim: {
    bootstrap: {
      deps: ['jquery']
    }
  }
});



define(['jquery', '/page.js', 'bootstrap','scripts/games','scripts/teams','scripts/contact','scripts/base','socket','ish'], function($) {  
  var Routes = {
  	frontpage: function () {
       $('#front-page-content').show().siblings('.page-role').hide();
       console.log("Front page");
    },
    games: function () {
       $("a[href='/games']").parent().addClass("active").siblings().removeClass('active');
        $('#games-content').showGames();
        console.log("games");

    },
    teams: function () {
      	$("a[href='/teams']").parent().addClass("active").siblings().removeClass('active');
        $('#teams-content').showTeams();
        console.log("teams");
    },
    about: function () {
    	$("a[href='/about']").parent().addClass("active").siblings().removeClass('active');
      $('#contact-content').showContact();
      console.log("about");
    }
  };


  $(function () {
    // Set up routes.
    page('/', Routes.frontpage);
    page('/games', Routes.games);
    page('/about', Routes.about);
    page('/teams', Routes.teams);
    page();
  });


  
});