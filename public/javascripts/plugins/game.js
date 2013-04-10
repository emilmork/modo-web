;(define(['jquery','scripts/base','socket','chart','handlebar'], function ($,base) {
  // Create the defaults once
  var pluginName = "showSelectedGame",
    defaults = {
      // Selectors for elements in our module view.
      gameInfoSelector: "#game-info",
      gameStatContainer: "#game-stat-container",
      startgameSelector: "#start-game"
    };

  // The actual plugin constructor
  function Plugin( element,req) {
    console.log(req.params.id);
    console.log(req.params.team);
    console.log("plugin constructor");
    this.gameName = req.params.id;
    this.teamName = req.params.team;

    this.el = element;
    this.$el = $(element);
    this.options = $.extend( {}, defaults);        
    this._defaults = defaults;
    this._name = pluginName;

    // Run INIT when constructor is called.
    this.init();
  }

  // Extend our plugin to implement the shared methods.
  $.extend(Plugin.prototype,base);

  // Initialize plugin
  Plugin.prototype.init = function () {
    this.showPage();

    // Save different HTML objects
    this.$gameInfo = this.$el.find(this.options.gameInfoSelector);
    this.$gameStats = this.$el.find(this.options.gameStatSelector);

    this.$el.on("click", this.options.startgameSelector, $.proxy(this.startGame, this));

    // bind event listeners
    this.bindEvents();
    this.getGame();

    var self = this;
    $(document).click(function(e) {
  // hide popup
      console.log("click");
      console.log(e);
      if(e.target.id == "remove-game"){
        console.log("has id remove-game");
        console.log("Target has id remove team");
        self.removeGame(e.target.value);
      }
    });

  };

  Plugin.prototype.startGame = function(){
    var params = {game_name : this.gameName};
    this.sendAction('startGame',params,function(response){
      if(response.started == 'ok'){
        $("#start-game").html("Started!");
        $('#start-game').attr("disabled", true);
      }
    });
  }

  Plugin.prototype.removeGame = function(game_name){
    var params = {'team_name': this.teamName, 'game_name' : game_name};
    this.sendAction('removeGame',params,function(response){
      if(response.deleted = "ok"){
          window.location = "/teams";
      }
    });
  }

  Plugin.prototype.showPage = function(){
    this.$el.show().siblings('.page-role').hide();
  }

  /**
   * Listen for different events. Also allows third party apps to communicate
   * with our plugin.
   **/
  Plugin.prototype.bindEvents = function () {
    //On change methods etc
  };


Plugin.prototype.getGame = function(){

  var source   = $('#agame').html();
  var template = Handlebars.compile(source);

  var self = this;
  var params = {'saved' : true, 'team_name' : this.teamName, 'game_name' : this.gameName};
  this.sendAction('getGame',params,function(response){
    var html = template(response.game);
    $('#game-info').empty();
    $('#game-info').append(html);

    self.renderStatistics(response.game);
  });
}

  Plugin.prototype.renderStatistics = function(game){

    var series_data = new Array();
    game.players.forEach(function(player){
      series_data.push({
        name: player.name,
        data: player.actions
      });
    });

    series_data.push({
      name : 'Total',
      data : game.actions
    });

    console.log(series_data);
    console.log(game.actions);


    $("#game-stat-container").highcharts({
        chart: {
            type: 'column',
            backgroundColor:'rgba(255, 255, 255, 0.1)'
        },
        title: {
            text: 'Game actions'
        },
        xAxis: {
            categories: ['Move people', 'New location','Calm down people', 'Used tool']
        },
        yAxis: {
            title: {
                text: 'Actions performed'
            }
        },
        series: series_data,
    });
  }


  // A really lightweight plugin wrapper around the constructor, 
  // preventing against multiple instantiations
  $.fn[pluginName] = function ( options ) {
    return this.each(function () {

        $.data( this, "plugin_" + pluginName, 
        new Plugin( this, options ));
    });
  };

  // Provide default options to allow people to change them.
  $.fn[pluginName].defaults = defaults;

}));